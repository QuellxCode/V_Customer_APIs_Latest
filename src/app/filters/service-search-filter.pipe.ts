import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'serviceSearchFilter'
})
export class ServiceSearchFilterPipe implements PipeTransform {

  // transform(value: any, args?: any): any {
  //   return null;
  // }

    transform(items: any[], searchText: string): any {

        if (!items) return [];
        // console.log("Items => ",items);
        if (!searchText) return items;

        searchText = searchText.toLowerCase();
        let filteredArray = [];
    //    return items.filter((company) => {

            // company[company_index].locations.filter((location, location_index) => {
            //     location[location_index].services.filter((service, service_index) => {
            //       return service[service_index].name.toLowerCase().includes(searchText);
            //     });
            // });

                // company.locations.filter( loc => {
                //  console.log("company.locations-> ",loc.location.name);
                //   return loc.location.name.toLowerCase().includes(searchText);
                // });

           // return company.locations.filter( loc => {
           //      console.log("company.locations-> ",loc.location.name);
           //     return loc.services.filter(service => {
           //          return service.name.toLowerCase().includes(searchText);
           //      });
           //  });

            // return company.locations.toLowerCase().includes(searchText);


    //    });

     items.forEach( comp => {
         let locationsArr = [];
         comp.locations.forEach( loc => {
            let servicesArr = loc.services.filter(service => {
                return service.service_name.toLowerCase().includes(searchText);

             }); // service Ends

             if(servicesArr.length > 0) {
                 locationsArr.push({
                     location:loc.location,
                     services: servicesArr
                 });
             }

         });  // LOC ENDS

         if(locationsArr.length > 0 ) {
             filteredArray.push({
                 company_name: comp.company_name,
                 locations: locationsArr
             })
         }
     });   // Comp ForEach Ends

            return filteredArray;


    }

}
