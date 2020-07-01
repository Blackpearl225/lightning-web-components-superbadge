import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

const BOAT_SEARCH_RESULTS_CMP = 'c-boat-search-results';
const NEW_BOAT_NAV_TYPE = 'standard__objectPage';
const BOAT_OBJECT_API_NAME = 'Boat__c';
const ACTION_NEW = 'new';

export default class BoatSearch extends NavigationMixin(LightningElement) {
	isLoading = false;

	handleLoading() { 
		this.isLoading = true;
	}

	handleDoneLoading() { 
		this.isLoading = false;
	}

	searchBoats(event) {
		const boatTypeId = event.detail.boatTypeId;
		this.template.querySelector(BOAT_SEARCH_RESULTS_CMP).searchBoats(boatTypeId);
	}

	createNewBoat() { 
		this[NavigationMixin.Navigate]({
			type: NEW_BOAT_NAV_TYPE,
			attributes: {
				objectApiName: BOAT_OBJECT_API_NAME,
				actionName: ACTION_NEW
			}
		});
	}
}