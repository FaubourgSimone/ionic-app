import { Component } from '@angular/core';

import { PolaPage } from '../pola/pola';
import { CalepinsPage } from '../calepins/calepins';
import { RadioPage } from '../radio/radio';
import { CasquePage } from '../casque/casque';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = RadioPage;
  tab2Root = PolaPage;
  tab3Root = CalepinsPage;
  tab4Root = CasquePage;

  constructor() {

  }
}
