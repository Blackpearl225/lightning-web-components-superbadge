import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const TOAST_TITLE = 'Review Created!';
const TOAST_SUCCESS_VARIANT = 'success';

export default class BoatAddReviewForm extends LightningElement {
	boatId;
	rating;

	@api
	get recordId() {
		return this.boatId;
	}
	set recordId(value) {
		this.boatId = value;
	}

	handleRatingChanged(event) {
		this.rating = event.detail.rating;
	}

	handleSubmit(event) {
		event.preventDefault();
		const fields = event.detail.fields;
		fields.Boat__c = this.boatId;
		fields.Rating__c = this.rating;
		this.template
			.querySelector('lightning-record-edit-form')
			.submit(fields);
	}

	handleSuccess() {
		this.dispatchEvent(
			new ShowToastEvent({
				title: TOAST_TITLE,
				variant: TOAST_SUCCESS_VARIANT
			})
		);
		this.dispatchEvent(new CustomEvent('createreview'));
		this.handleReset();
	}

	handleReset() { 
		const inputFields = this.template.querySelectorAll(
			'lightning-input-field'
		);
		if (inputFields) {
			inputFields.forEach(field => {
				field.reset();
			});
		}
	}
}