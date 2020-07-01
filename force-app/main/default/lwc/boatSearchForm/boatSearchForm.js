import { LightningElement, track, wire } from 'lwc';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';

const ALL_TYPES = 'All Types';
const EMPTY_TYPE = '';

export default class BoatSearchForm extends LightningElement {

	selectedBoatTypeId = EMPTY_TYPE;

	error = undefined;

	@track
	searchOptions;

	@wire(getBoatTypes)
	boatTypes({ error, data }) {
		if (data) {
			this.searchOptions = data.map(type => ({ label: type.Name, value: type.Id }));
			this.searchOptions.unshift({ label: ALL_TYPES, value: EMPTY_TYPE });
		} else if (error) {
			this.searchOptions = undefined;
			this.error = error;
		}
	}

	handleSearchOptionChange(event) {
		this.selectedBoatTypeId = event.target.value;
		const searchEvent = new CustomEvent('search', { 
			detail: {
				boatTypeId: this.selectedBoatTypeId
			}
		});
		this.dispatchEvent(searchEvent);
	}
}