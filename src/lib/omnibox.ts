import { WandletManager } from "./wandlet-manager";

export class Omnibox {
  private wandletManager = new WandletManager;
  private wandlets: Record<string, string> | null = null;
  public port: chrome.runtime.Port | null = null;

  constructor() {
    this.resetDefaultSuggestion();
    chrome.omnibox.onInputEntered.addListener(this.onInputEntered);
    chrome.omnibox.onInputChanged.addListener(this.onInputChanged);
    chrome.omnibox.onInputStarted.addListener(async () => {
      this.updateDefaultSuggestion('');
      this.wandlets = null;
      this.wandlets = await this.wandletManager.get();
    });

    chrome.omnibox.onInputCancelled.addListener(() => {
      this.wandlets = null;
      this.resetDefaultSuggestion();
    });

  }

  onInputChanged = async (text: string, suggest: (result: chrome.omnibox.SuggestResult[]) => void) => {
    if (text.length == 0) {
      this.resetDefaultSuggestion();
      return;
    }

    this.updateDefaultSuggestion(text);
    if (text == '?' || text == 'help') {
      return;
    }
    const result: chrome.omnibox.SuggestResult[] = [];
    if (!this.wandlets) {
      this.wandlets = await this.wandletManager.get();
    }
    if (!this.wandlets) return;
    const entries = Object.entries(this.wandlets);
    if (!entries.length) {
      return;
    }
    const resultFromValue: chrome.omnibox.SuggestResult[] = [];
    for (const [key, value] of entries) {
      if (key.match(new RegExp(text,'i'))) {
        result.push({
          content: `${key}@@${value}`,
          description: `<match>${key}</match> ${value}`
        });
      }
      if (value.match(new RegExp(text,'i'))) {
        resultFromValue.push({
          content: `${key}@@${value}`,
          description: `<match>${key}</match> <dim>${value}</dim>`
        });
      }
    }
    console.log(result.concat(resultFromValue));
    suggest(result.concat(resultFromValue));
  }

  onInputEntered = (text: string, disposition: chrome.omnibox.OnInputEnteredDisposition) => {
    if (text.length == 0) {
      return;
    }
    if (text == '?' || text == 'help') {
      this.navigate('');
      return;
    }
    const [key, value] = text.split('@@');
    if (key && value) {
      this.navigate(value);
    }
  }

  private resetDefaultSuggestion() {
    chrome.omnibox.setDefaultSuggestion({
      description: '<url><match>Wand:</match></url> <dim>Type Wandlet to Use...</dim>'
    });
  }

  private updateDefaultSuggestion(text: string) {
    var isWandLet = /^let:/.test(text);
    var isHelp = (text == '?' || text == 'help');
    var isPlaintext = text.length && !isWandLet && !isHelp;

    var description = '<match><url>Wand:</url></match><dim> [</dim>';
    description +=
      isPlaintext ? ('<match>' + text + '</match>') : 'plaintext-search';
    description += '<dim> | </dim>';
    description += isWandLet ? ('<match>' + text + '</match>') : 'let:wandlet-search';
    description += '<dim> | </dim>';
    description += isHelp ? '<match>help</match>' : 'help';
    description += '<dim> ]</dim>';

    chrome.omnibox.setDefaultSuggestion({
      description: description
    });
  }
  private async navigate(url: string) {
    const activeTab = (await chrome.tabs.query({ active: true, currentWindow: true }))[0];
    if (url.startsWith('javascript:')) {
      // chrome.tabs.executeScript(activeTab.id, { code: url.substring(11) });
      // chrome.scripting.executeScript({
      //   target: { tabId: activeTab.id!, allFrames: true },
      //   func: url => { eval(url.substring('javascript:'.length)) },
      //   args: [url]
      // });
      console.log('executeScript', url);
      this.port?.postMessage({code: url});
      return;
    }

    chrome.tabs.update(activeTab.id!, { url: url });

  }

} 