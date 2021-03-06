import { Component, Input } from '@angular/core';
import { CrudComponentObj } from '../index';
import { SelectItem } from 'primeng/primeng';
import { Service } from '../services/index';
import { Observable } from 'rxjs/Rx';
import { BaseComponent } from './base.component';

@Component({
    selector: 'inputText',
    providers: [Service],
    template: `
        <div class="row">
            <div class="col-md-4">    
                <label>{{name}}</label>
            </div>
            <div class="col-md-8">    
                <p-multiSelect [options]="itens" [(ngModel)]="selectedItem" (onChange)="setValue($event.value)"></p-multiSelect>            
            </div>            
        </div>
    `
})

export class MultiSelectComponent extends BaseComponent {
    constructor(public service: Service) {
        super();
    }
    
    @Input()
    index : number;
    
    name : string;
       
    itens: SelectItem[] = [];
    
    selectedItem: string[];
    
    ngOnInit() {       
        this.readCommonsParameters(this.index);
        let crudComponentObj = CrudComponentObj.components[this.index];
        this.getMultiSelectValues(crudComponentObj.url)
            .subscribe(values => {
                values.forEach(val => {
                    if (crudComponentObj.selectItemArray == undefined) {
                        this.itens.push({ label: val[crudComponentObj.selectItemLabel], value: val[crudComponentObj.selectItemValue] });
                    } else {
                        val[crudComponentObj.selectItemArray].forEach((val:any) => {
                            this.itens.push({ label: val[crudComponentObj.selectItemLabel], value: val[crudComponentObj.selectItemValue] });                            
                        });
                    }
                });
            },
            error => {
                console.log(error);
            });
    }
    
    getMultiSelectValues(url : string): Observable<any[]> {
        this.service.setHeader(null, false);
        return this.service.get(url);
    }
    
       
    setValue(value:string[]){
        let crudComponentObj = CrudComponentObj.components[this.index];
        CrudComponentObj.components[this.index].value = [];
        value.forEach(v => {
            let selectClazz = new crudComponentObj.selectClazz();
            selectClazz[crudComponentObj.selectItemValue] = v;
            this.itens.forEach(item => {
                if (item.value == v) {
                    selectClazz[crudComponentObj.selectItemLabel] = item.label;
                }
            });
            CrudComponentObj.components[this.index].value.push(selectClazz);
        });
    }
}



