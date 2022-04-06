import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { InvestorService } from '../investor/investor.service';
import * as Highcharts from 'highcharts';
import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.css']
})
export class AccountStatementComponent implements OnInit {
  @ViewChild('container') container : any;
  Highcharts: typeof Highcharts = Highcharts;
  @Input() AccountStatementData: any;
  @Output() messageEvent = new EventEmitter<string>();
  AccountStatementPopup: boolean = false;
  AccountStatement: any;
  Loader: boolean = false;
  TotalInvestedAmount: any;
  TotalFundedAmount: any;
  TotalDistributions: any;
  TotalDFunded: any;
  TotalOperatingIncome: any;
  TotalGainOnSale: any;
  TotalRefinanceProceeds: any;
  TotalReturnOfCapital: any;
  TotalPreferredReturn: any;
  TotalInterest: any;
  TotalInvestmentBalance: any;
  InvestorId: any;
  pieChartData: any = [];
  chartOptions: any;
  AccountPortFolio: any = [];
  AccountPortFolioData: any = [];

  constructor(private investorService: InvestorService) { }

  ngOnInit(): void {
    this.InvestorId = Number(localStorage.getItem("InvestorId"));
  }

  onAccountStatement() {
    this.Loader = true;
    this.investorService.GetAccountStatement(this.AccountStatementData.InvestorId).subscribe(data => {
      this.AccountStatement = data;
      if (this.AccountStatement != null) {
        this.AccountStatementPopup = true;
      }
      this.TotalInvestedAmount = 0;
      this.TotalFundedAmount = 0;
      this.TotalDistributions = 0;
      for (let i = 0; i < this.AccountStatement.investmentOverviews.length; i++) {
        this.TotalInvestedAmount = this.TotalInvestedAmount + this.AccountStatement.investmentOverviews[i].investmentAmount
        this.TotalFundedAmount = this.TotalFundedAmount + this.AccountStatement.investmentOverviews[i].fundedAmount
        this.TotalDistributions = this.TotalDistributions + this.AccountStatement.investmentOverviews[i].distributions
      }
      this.TotalDFunded = 0;
      this.TotalOperatingIncome = 0;
      this.TotalGainOnSale = 0;
      this.TotalRefinanceProceeds = 0;
      this.TotalReturnOfCapital = 0;
      this.TotalPreferredReturn = 0;
      this.TotalInterest = 0;
      this.TotalInvestmentBalance = 0;
      for (let i = 0; i < this.AccountStatement.distributionsSummaries.length; i++) {
        this.TotalDFunded = this.TotalDFunded + this.AccountStatement.distributionsSummaries[i].funded
        this.TotalOperatingIncome = this.TotalOperatingIncome + this.AccountStatement.distributionsSummaries[i].operatingIncome
        this.TotalGainOnSale = this.TotalGainOnSale + this.AccountStatement.distributionsSummaries[i].gainOnSale
        this.TotalRefinanceProceeds = this.TotalRefinanceProceeds + this.AccountStatement.distributionsSummaries[i].refinanceProceeds
        this.TotalReturnOfCapital = this.TotalReturnOfCapital + this.AccountStatement.distributionsSummaries[i].returnOfCapital
        this.TotalPreferredReturn = this.TotalPreferredReturn + this.AccountStatement.distributionsSummaries[i].preferredReturn
        this.TotalInterest = this.TotalInterest + this.AccountStatement.distributionsSummaries[i].interest
        this.TotalInvestmentBalance = this.TotalInvestmentBalance + this.AccountStatement.distributionsSummaries[i].investmentBalance
      }
      this.AccountPortFolio = [];
      this.AccountPortFolioData = [];
      for (let i = 0; i < this.AccountStatement.portfolio.length; i++) {
        if (this.AccountStatement.portfolio[i].portfolioPercentage != 0) {
          this.AccountPortFolio.push(this.AccountStatement.portfolio[i]);
          this.AccountPortFolioData.push({
            name : this.AccountStatement.portfolio[i].offeringName,
            y : this.AccountStatement.portfolio[i].portfolioPercentage
          })
        }
      }
      this.chartOptions = {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: 'Portfolio'
        },
        tooltip: {
          pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                // color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            },
            showInLegend: true
          }
        },
        series: [{
          name: 'Brands',
          colorByPoint: true,
          data: this.AccountPortFolioData
        }]
      };
      this.Loader = false;
    })
  }

  EditStatement(val: any) {
    this.AccountStatementData = {
      InvestorId: val.InvestorId
    }
    this.onAccountStatement();
    this.messageEvent.emit();
  }

  onDownloadStatement() {
    this.Loader = true;
    var scale = 2;
    setTimeout(
      () =>
        domtoimage
          .toPng(this.container.nativeElement, {
            width: this.container.nativeElement.clientWidth * 6,
            height: this.container.nativeElement.clientHeight * 2,
            style: {
             transform: 'scale('+scale+')',
             transformOrigin: 'top left'
           }})
          .then( (dataUrl: string) => {
            var img = new Image();
            img.src = dataUrl;
            let account = {
              Imagesource : dataUrl,
              AccountStatement : 'text',
              InvestorId : this.InvestorId
            }
            // let link = document.createElement('a');
            // link.href = img.src;
            // console.log(img.src, 'image');
            // link.download = 'DealDocument.png';
            // link.click();
            this.investorService.DownloadAccountStatement(account).subscribe(data =>{
              if(data != null){
                let link = document.createElement('a');
                link.href = data.accountStatement;
                link.download = 'AccountStatement.pdf'
                link.click();
                this.Loader = false;
              }
              else{
                this.Loader = false;
              }
            })
            document.body.appendChild(img);
          })
          .catch(function (error: any) {
            console.error('oops, something went wrong!', error);
          }),
      1000
    );
  }

  onSendEmail() {

  }

}
