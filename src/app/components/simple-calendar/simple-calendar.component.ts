import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CalendarDay, CalendarMonth, CalendarValues, CalendarWeek, WeekDay } from './calendar.model';
import moment from 'moment';
import { Popover } from 'bootstrap';

@Component({
  selector: 'app-simple-calendar',
  templateUrl: './simple-calendar.component.html',
  styleUrls: ['./simple-calendar.component.scss']
})
export class SimpleCalendarComponent implements OnInit , OnChanges, AfterViewInit{  
  currentMonths:CalendarMonth[] = new Array<CalendarMonth>();
  currentDays:Array<CalendarWeek> = new Array<CalendarWeek>();
  monthNames:Array<string> = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  daysNames:Array<WeekDay> = [{name:"Lunes",shortName:"Lu"}, {name:"Martes",shortName:"Ma"}, {name:"Miercoles",shortName:"Mi"}, 
                              {name:"Jueves",shortName:"Ju"}, {name:"Viernes",shortName:"Vi"}, {name:"Sabado",shortName:"Sá"}, {name:"Domingo",shortName:"Do"}];
  prevDate: Date = new Date();
  nextDate: Date = new Date();  
  currentDate:Date = new Date();
  popOverList:Popover[] = new Array<Popover>();

  @Input() preselectDate:CalendarValues[] = new Array<CalendarValues>();
  
  constructor() {

  }
  
  ngAfterViewInit(): void {
    this.initTooltip();
    let elements = document.querySelectorAll('.popover-body');
    elements.forEach(element => {
      (element as HTMLElement).style.backgroundColor = "rgb(17, 43, 70,0.9)";
      (element as HTMLElement).style.color = "white";
      (element as HTMLElement).style.padding = "5px";
      (element as HTMLElement).style.borderRadius = "3px";      
    });  
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnInit(): void {
    this.init();
    
  }

  next(){
    this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth()+1));
    this.currentDays = new Array<CalendarWeek>();
    this.init();
  }

  prev(){
    this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth()-1));
    this.currentDays = new Array<CalendarWeek>();
    this.init();
  }

  init(){
    let strPreselectDay:string[] = this.preselectDate.map((ciclo:CalendarValues) => ciclo.fecha!)
    this.currentMonths = this.getThreeMonth(this.currentDate);
    let days:Date[] = new Array<Date>();
    for (let index = 0; index < this.currentMonths.length; index++) {
      let element = this.currentMonths[index];
      let months = this.getDaysInMonth(element.numero, element.ano);
      days.push(...months)
    }
    
    let calendarWeek:CalendarWeek = { days:[] as CalendarDay[],show : false, mes:''} as CalendarWeek;
    //verificamos si la lista de dias comienza en lunes
    if(days[0].getDay() != 0){
      let diaSemana = days[0].getDay()-1;
      for (let index = 0; index < diaSemana; index++) {
        let calDay:CalendarDay = { numero : '' } as CalendarDay;
        calendarWeek.days.push(calDay)
      }
    }

    let month:string = this.currentDate.toLocaleDateString('es-CL', { month: 'long' })
    for (let index = 0; index < days.length; index++) {      
      let element = days[index];  
      let calDay:CalendarDay = { month: element.toLocaleDateString('es-CL', { month: 'long' }), 
                                 numero : element.getDate().toString(), 
                                 name: element.toLocaleDateString('es-CL', { weekday: 'long' }), 
                                 isSelected: strPreselectDay.includes(moment(element).format("DD/MM/YYYY")),
                                 isOpaque:!(month == element.toLocaleDateString('es-CL', { month: 'long' })),
                                 shortDate: moment(element).format("DD/MM/YYYY") } as CalendarDay;

      if(calendarWeek.days.length == 7){
        calendarWeek.mes = element.toLocaleDateString('es-CL', { month: 'long' });
        calendarWeek.show = element.toLocaleDateString('es-CL', { month: 'long' }) == month || calendarWeek.days[0].month == month;
        this.currentDays.push(calendarWeek);
        calendarWeek = { days:[] as CalendarDay[], show : false, mes:''} as CalendarWeek;
      }
      calendarWeek.days.push(calDay);      
    }
    this.currentDays.push(calendarWeek);
    this.initTooltip();
  }
  
  getDaysInMonthUTC(month:number, year:number) {
    let date = new Date(Date.UTC(year, month, 1));
    let days = [];
    while (date.getUTCMonth() === month) {
      days.push(new Date(date));
      date.setUTCDate(date.getUTCDate() + 1);
    }
    return days;
  }

  /**
   * @param {int} The month number, 0 based
   * @param {int} The year, not zero based, required to account for leap years
   * @return {Date[]} List with date objects for each day of the month
   */
  getDaysInMonth(month:number, year:number) {
    let date:Date = new Date(year, month, 1);
    let days:Date[] = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  getThreeMonth(date:Date): Array<CalendarMonth>{
    let tmpMonths:CalendarMonth[] = new Array<CalendarMonth>();
    switch (date.getMonth()) {
      case 0:
        this.prevDate = new Date(date.getFullYear()-1, 11, 1);
        this.nextDate = new Date(date.getFullYear(), 1, 1);
        tmpMonths.push(...[{ nombre:this.monthNames[this.prevDate.getMonth()], numero:this.prevDate.getMonth(), ano: this.prevDate.getFullYear(), selected:false} , 
                          { nombre:this.monthNames[date.getMonth()], numero:date.getMonth(), ano:date.getFullYear(), selected:true}, 
                          { nombre:this.monthNames[this.nextDate.getMonth()], numero:this.nextDate.getMonth(), ano:this.nextDate.getFullYear(), selected:false}]);
        break;
      case 11:
        this.prevDate = new Date(date.getFullYear(), 10, 1);
        this.nextDate = new Date(date.getFullYear()+1, 0, 1);
        tmpMonths.push(...[{ nombre:this.monthNames[this.prevDate.getMonth()], numero:this.prevDate.getMonth(), ano: this.prevDate.getFullYear(), selected:false} , 
                          { nombre:this.monthNames[date.getMonth()], numero:date.getMonth(), ano:date.getFullYear(), selected:true}, 
                          { nombre:this.monthNames[this.nextDate.getMonth()], numero:this.nextDate.getMonth(), ano:this.nextDate.getFullYear(), selected:false}]);
        break;    
      default:
        this.prevDate = new Date(date.getFullYear(), date.getMonth()-1, 1);
        this.nextDate = new Date(date.getFullYear(), date.getMonth()+1, 1);
        tmpMonths.push(...[{ nombre:this.monthNames[this.prevDate.getMonth()], numero:this.prevDate.getMonth(), ano: this.prevDate.getFullYear(), selected:false} , 
        { nombre:this.monthNames[date.getMonth()], numero:date.getMonth(), ano:date.getFullYear(), selected:true}, 
        { nombre:this.monthNames[this.nextDate.getMonth()], numero:this.nextDate.getMonth(), ano:this.nextDate.getFullYear(), selected:false}]);

        break;
    }

    return tmpMonths;
  }

  initTooltip(){
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    
    this.popOverList = tooltipTriggerList.map(function (tooltipTriggerEl:any) {
      tooltipTriggerEl.addEventListener('show.bs.popover', function (event:any) {
        console.log(event)
      })
      return new Popover(tooltipTriggerEl,{container:'#calendar-ds'})
    })
  }

  showAll(){
    this.popOverList.forEach((element:any) => {
      element.show()
    });
  }
}