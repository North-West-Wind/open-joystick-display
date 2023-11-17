import clone from "clone";
import store from "store";
import Config from "./config.class";
import { DataMapping } from "./data";

import mappingJson from "../data/mapping.json";

export default class Mappings {
	config: Config;
	mappings: DataMapping[];

	constructor(config: Config) {
		this.config = config;
		this.mappings = store.get('mappings');
	}

	/* 
		///////////////////////////
	 		Getters
	 	///////////////////////////
	*/

	getMappings() {
		return this.mappings;
	}

	getMapping(id: number) {
		return this.mappings[id];
	}

	/* 
		///////////////////////////
	 		Operators
	 	///////////////////////////
	*/

	/*
	 * create()
	 * @param integer id
	 * @param object mapping
	 * @return integer
	 * Updates a mapping by id.
	 */
	update(id: number, mapping: DataMapping) {
		this.mappings[id] = mapping;
		this.save();

	}

	/*
	 * create()
	 * @return integer
	 * Creates a new blank template mapping.
	 */
	create() {
		const id = this.mappings.length; // Will always be one ahead. Thanks zero index;
		const mapping = clone(mappingJson);
		this.mappings.push(mapping);
		this.save();
		return id;
	}

	/*
	 * clone(id)
	 * @param integer id
	 * @return integer
	 * Creates a new mapping based on a previous mapping.
	 */
	clone(id: number) {
		const newId = this.mappings.length;
		const mapping = clone(this.getMapping(id));
		mapping.name = mapping.name + ' (Cloned)';
		this.mappings.push(mapping);
		this.save();
		return newId;
	}

	/*
	 * remove(id)
	 * @param integer id
	 * @return integer
	 * Removes a mapping. If all are removed, a new one will be created in its place.
	 */
	remove(id: number) {
		this.mappings.splice(id, 1);
		if (this.mappings.length === 0) {
			this.create();
		}
		this.save();
		return 0;
	}

	/*
	 * save()
	 * @return NULL
	 * Saves all mappings
	 */
	save() {
		store.set('mappings', this.mappings);
	}

	// Move to profile?
	reset() {
		$(`*[ojd-directional]`).css('top',``);
		$(`*[ojd-directional]`).css('left',``);
		$(`*[ojd-directional]`).removeClass('active');
		$(`*[ojd-button]`).removeClass('active');
		$(`*[ojd-trigger-scale]`).css('height', '');
		$(`*[ojd-trigger-scale-inverted]`).css('height', '');
		$(`*[ojd-trigger]`).removeClass('trigger-active');
		$(`*[ojd-trigger-move]`).css('top', ``);
		$(`*[ojd-trigger-move-inverted]`).css('bottom', ``);
		$(`*[ojd-trigger-move-inverted]`).css('top', ``);
		$(`*[ojd-arcade-directional]`).css('top',``);
		$(`*[ojd-arcade-directional]`).css('left',``);

	}
}