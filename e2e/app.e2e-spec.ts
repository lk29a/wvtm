import { WvtmPage } from './app.po';

describe('wvtm App', function() {
  let page: WvtmPage;

  beforeEach(() => {
    page = new WvtmPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
