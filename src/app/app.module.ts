import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Chart1Component } from './chart1/chart1.component';
import { Chart2Component } from './chart2/chart2.component';
import { Chart3Component } from './chart3/chart3.component';
import { RouterModule, Routes } from '@angular/router'

export const routerConfig: Routes = [
  {
      path: 'chart1',
      component: Chart1Component
  },
  {
      path: 'chart2',
      component: Chart2Component
  },
  {
      path: 'chart3',
      component: Chart3Component
  },
  {
      path: '',
      redirectTo: 'chart1',
      pathMatch: 'full'
  },
  {
      path: '**',
      redirectTo: 'chart1',
      pathMatch: 'full'
  }
];
@NgModule({
  declarations: [
    AppComponent,
    Chart1Component,
    Chart2Component,
    Chart3Component
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      routerConfig,
      { useHash : true} // <-- debugging purposes only
    )

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
