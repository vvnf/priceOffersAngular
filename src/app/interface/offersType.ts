export type UpdateMediaList = Array<offers>;

interface offers{
    departureDate:Date,
    destination:string,
    offerType:string,
    origin:string,
    price:object,
    returnDate:Date,
    seatAvailability:number,
    uuid:string,
    departureDateDisplay:string,
    returnDateDisplay:string,
    originCity:string,
    destinationCity:string,
}