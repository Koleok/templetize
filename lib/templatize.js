/* globals atom */

'use babel';

import { CompositeDisposable } from 'atom';
import TemplatizeView from './templatize-view';
import convert from './convertToTemplate';

export default {

  templatizeView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.templatizeView = new TemplatizeView(state.templatizeViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.templatizeView.getElement(),
      visible: false,
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'templatize:convert': () => this.convertToTemplate(),
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.templatizeView.destroy();
  },

  serialize() {
    return {
      templatizeViewState: this.templatizeView.serialize(),
    };
  },

  convertToTemplate() {
    const {
      insertText,
      getSelectedText,
    } = atom.workspace.getActiveTextEditor();

    if (insertText) insertText(convert(getSelectedText()));
  },
};
