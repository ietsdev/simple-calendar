export interface CalendarDay{
    name:string,
    numero:string,
    isSelected:boolean,
    isOpaque:boolean,
    month:string,
    shortDate:string,
    date: Date
}

export interface WeekDay{
    name:string,
    shortName?:string
}

export interface CalendarWeek{
    days:CalendarDay[],
    ano:number,
    mes:string,
    selected:boolean,
    show:boolean
}

export interface CalendarMonth{
    nombre:string,
    numero:number,
    ano:number,
    selected:ConstrainBoolean
}

export interface CalendarValues{
    fecha?: string,
    ciclo?: number,
    color?: string,
    dot?: boolean,
    listaIndicaciones?: CalendarValueDetail[]
}

export interface CalendarValueDetail{    
    dosis?:string,
    hora?: string      
}
