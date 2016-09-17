'use babel';
/* globals atom */

import { CompositeDisposable } from 'atom';
import convert from './convertToTemplate';

export default {

  templatizeView: null,
  modalPanel: null,
  subscriptions: null,

  activate() {
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
    const editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      editor.insertText(
        convert(editor.getSelectedText())
      );
    }
  },
};
