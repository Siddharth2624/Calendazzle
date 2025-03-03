export type FromTo = {
    from: string,
    to: string,
    active: boolean
};

export type WeekDayName = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' ;

export type BookingTimes =  Partial<Record<WeekDayName, FromTo>>;