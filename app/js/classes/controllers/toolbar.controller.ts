import $ from "jquery";
import { ojd } from "../..";
import RootController from "./root.controller";

export default class ToolbarController {
	rootId = '#ojd-toolbar';
	aboutId = '#ojd-about-model';
	objectIds = {
		btnReload:'#ojd-toolbar-reload',
		btnDevTools:'#ojd-toolbar-dev',
		btnResetConfig:'#ojd-toolbar-reset',
		btnAbout:'#ojd-toolbar-about',
		btnDownload:'#ojd-toolbar-download',
		btnCloseModal:'.ojd-modal-close'
	};
	rootController: RootController;
	aboutDialog: boolean;

	constructor(rootController: RootController) {
		this.rootController = rootController;
		this.aboutDialog = false;
		//this.localVersion = false;
		//this.remoteVersion = false;
	}

	/* We're not checking version because I don't care enough
	checkVersion() {
		$.get(OJD.appendCwdPath('app/version'), function( data ) {
		  this.localVersion = data;
		  $(".ojd-version").html(this.localVersion);
		  $.get({url:'https://ojdproject.com/version.txt',cache: false}, function( data ) {
		 	 this.remoteVersion = data.trim();
		 	 if (this.localVersion != this.remoteVersion) {
		 	 	$(`${this.rootId} ${this.objectIds.btnDownload}`).show();
		 	 }
			}.bind(this));
		}.bind(this));
	}
	*/

	bindEvents() {
		$(`${this.rootId} ${this.objectIds.btnReload}`).bind('click', this.onReload.bind(this));
		$(`${this.rootId} ${this.objectIds.btnResetConfig}`).bind('click', this.onResetConfig.bind(this));
		$(`${this.rootId} ${this.objectIds.btnAbout}`).bind('click', this.onAbout.bind(this));
		$(`${this.aboutId} ${this.objectIds.btnCloseModal}`).bind('click', this.onAbout.bind(this));
	}

	onReload() {
		location.reload();
	}

	onResetConfig() {
		if (confirm("Are you should you want to reset your config?\nAll settings and mappings will be lost.")) {
			this.rootController.config.reset();
			this.onReload();
		}
	}

	onAbout() {
		this.aboutDialog = !this.aboutDialog;
		if (this.aboutDialog) {
			$(`${this.aboutId} > div`).show();
		} else {
			$(`${this.aboutId} > div`).hide();
		}
	}

	async renderInitialAbout() {

		const files = [
			await ojd.fetchFile("./components/about.view.html")
		];

		$(this.aboutId).html("");
		for (const html of files) {
			$(this.aboutId).append(html!);
		}

	}

	async renderInitial() {

		const files = [
			await ojd.fetchFile("./components/toolbar.view.html")
		];

		$(this.rootId).html("");
		for (const html of files) {
			$(this.rootId).append(html!);
		}

		this.renderInitialAbout();
		this.bindEvents();
		//this.checkVersion();
	}
}
