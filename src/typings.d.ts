/* SystemJS module definition */
declare var module: NodeModule;

//For Stripe and Stripe Elements
declare var stripe: any;
declare var elements: any;

interface NodeModule {
    id: string;
}
interface JQuery {
    mMenu(options: any): JQuery;
    animateClass(options: any): JQuery;
    setActiveItem(item: any): JQuery;
    getPageTitle(item: any): JQuery;
    getBreadcrumbs(item: any): JQuery;
    validate(options: any): JQuery;
    valid(): JQuery;
    resetForm(): JQuery;
    markdown(): JQuery;
}
