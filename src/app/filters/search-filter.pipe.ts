import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

    transform(items: any[], searchText: string): any {

        if (!items) return [];
        // console.log("Items are => ",items);
        if (!searchText) return items;

        searchText = searchText.toLowerCase();

        return items.filter(it => {
            return it.company_name.name.toLowerCase().includes(searchText);
        });
    }

    // transform(items: any[], searchText: string, value: string): any[] {
    //     if (!items) return [];
    //     return items.filter(it => it[searchText] == value);
    // }

}
