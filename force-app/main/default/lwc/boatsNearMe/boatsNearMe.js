import { LightningElement, wire, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';

const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';

export default class BoatsNearMe extends LightningElement {
	@api
	boatTypeId;

	@track
	mapMarkers = [];

	isLoading = true;
	isRendered;
	latitude;
	longitude;

	@wire(getBoatsByLocation, { 
		latitude: '$latitude', 
		longitude: '$longitude', 
		boatTypeId: '$boatTypeId'
	})
	wiredBoatsJSON({ error, data }) {
		if (data) {
			this.createMapMarkers(JSON.parse(data));
		} else if (error) {
			this.mapMarkers = [];
			const errorMessage = new ShowToastEvent({
				title: ERROR_TITLE,
				variant: ERROR_VARIANT,
			});
			this.dispatchEvent(errorMessage);
			this.isLoading = false;
		}
	}

	renderedCallback() { 
		if (!this.isRendered) {
			this.isRendered = true;
			this.getLocationFromBrowser();
		}
	}

	getLocationFromBrowser() { 
		navigator.geolocation.getCurrentPosition(
			position => {
				this.latitude = position.coords.latitude;
				this.longitude = position.coords.longitude;
			}
		);
	}

	createMapMarkers(boatData) { 
		this.mapMarkers = boatData.map(boat => ({
			title: boat.Name, 
			location: {
				Latitude: boat.Geolocation__Latitude__s,
				Longitude: boat.Geolocation__Longitude__s
			}
		}));
		this.mapMarkers.unshift({
			title: LABEL_YOU_ARE_HERE,
			icon: ICON_STANDARD_USER,
			location: {
				Latitude: this.latitude,
				Longitude: this.longitude
			}
		});
		this.isLoading = false;
	}
}