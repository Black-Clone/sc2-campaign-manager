import React, { Component } from 'react';
import { HashRouter as Router, Route, Link } from "react-router-dom";

import campaignStore from '../api/campaignStore'
import authorStore from '../api/authorStore'

import { setGlobal } from 'reactn';
import Counter from "../components/Counter.js";
import NavBar from '../components/NavBar';
import CampaignPane from '../containers/CampaignPane';
import MapMakerPane from '../containers/MapMakerPane'

class Home extends Component {
    constructor(props) {
		super(props);
		const selectedPaneLocal = (localStorage.getItem('selectedPane')!==null)?localStorage.getItem('selectedPane'):"campaigns";
		const selectedCampaignLocal = (localStorage.getItem('selectedCampaign')!==null)?localStorage.getItem('selectedCampaign'):null;
		this.state = {
			"campaigns": [], 
			"authors": null,
			"selectedCampaign": null, 
			"selectedCampaignAuthor": null,
			"selectedPane": selectedPaneLocal
		};
		campaignStore.getCampaigns((campaigns)=>{
			console.log("campaignStore.getCampaigns campaigns", campaigns);
			//let selectedCampaign = null;
			this.setState({
				"campaigns":campaigns
			});
			campaignStore.getCampaignFromSources().then(remoteCampaigns =>{
				console.log("campaignStore.getCampaignFromSources campaigns", remoteCampaigns);
				this.setState({
					"campaigns":remoteCampaigns
				});
				setGlobal({
					campaignCount:remoteCampaigns.length
				});
			});
		});
		/* 
		campaignStore.getCampaign(selectedCampaign,(campaign)=>{
			console.log("campaignStore.getCampaign campaign",campaign);
			authorStore.getAuthor(campaign.author,(author)=>{
				console.log("campaignStore.getCampaign author",author);
				this.setState({
					"selectedCampaignAuthor": author,
				})
			})
			this.setState({
				"selectedCampaign": campaign,
			})
		}) */
		authorStore.getAuthors((authors)=>{
			this.setState({
				"authors":authors
			});
		});
		
		/* const conn = new scrapper.MapsterConnection();

		(async function() {
			const projectName = 'thoughts-in-chaos';
			const result = await conn.getProjectOverview(projectName);
			console.log(result);
		})(); */
		
	}

	handleCampaignItemClick = (item) => {
		localStorage.setItem('selectedCampaign',item.id)
		this.setState({
			selectedCampaign:item
		});
	};

	handleSelectedPaneClick = (item) => {
		localStorage.setItem('selectedPane',item)
		this.setState({
			selectedPane:item
		});
	};

	handleDownloadCampaignClick = (campaign) => {
		console.log("Downloading "+campaign.id);
	};

	render() {
		const {selectedPane, campaigns,selectedCampaign, selectedCampaignAuthor} = this.state
		const onDownloadCampaignClick = this.handleDownloadCampaignClick;
		return (
		<Router>
			<>
			<NavBar />
			<main className="container-fluid w-100 h-100">
				<Route path="/" exact component={CampaignPane} />
				<Route path="/campaign" render={()=>
					<CampaignPane 
						campaigns={campaigns}
						selectedCampaign={selectedCampaign}
						selectedCampaignAuthor={selectedCampaignAuthor}
						onCampaignItemClick={this.handleCampaignItemClick}
						onDownloadCampaignClick={onDownloadCampaignClick}
					/>
				} />
				<Route path="/mapmakers" render={()=>
					<MapMakerPane
						campaigns={campaigns}
						selectedCampaign={selectedCampaign}
						onCampaignItemClick={this.handleCampaignItemClick}
					/>
				 } />
				<Route path="/settings" exact render={() => <h3>Please select a topic.</h3>} />
			</main>
			</>
		</Router>
		);
	}   
}
	
export default Home;
