import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';

const RECORD_PAGE_NAV_TYPE = 'standard__recordPage';
const ACTION_VIEW = 'view';

export default class BoatReviews extends NavigationMixin(LightningElement) {
	boatId;
	error;
	boatReviews;
	isLoading;

	@api
	get recordId() {
		return this.boatId;
	}
	set recordId(value) {
		this.boatId = value;
		this.getReviews();
	}

	get reviewsToShow() {
		return this.boatReviews && this.boatReviews.length > 0;
	}

	@api
	refresh() {
		this.getReviews();
	}

	getReviews() {
		if (this.boatId) {
			this.isLoading = true;
			getAllReviews({
				boatId: this.boatId
			})
			.then(result => {
				this.boatReviews = result;
				this.isLoading = false;
			})
			.catch(error => {
				this.error = error;
				this.isLoading = false;
			});
		}
	}

	navigateToRecord(event) {
		const userId = event.target.dataset.recordId;

		this[NavigationMixin.Navigate]({
			type: 'standard__recordPage',
			attributes: {
				recordId: userId,
				actionName: 'view'
			},
		});

	}
}