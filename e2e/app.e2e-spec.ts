import { WVTMPage } from './app.po';

describe('wvtm App', function() {
  let page: WVTMPage;

  beforeEach(() => {
    page = new WVTMPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
