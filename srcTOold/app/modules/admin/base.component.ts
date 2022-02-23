import { Component, OnDestroy } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { FormArray, FormGroup } from '@angular/forms';
import * as FileSaver from 'file-saver';
@Component({
    template: '',
})
export abstract class BaseComponent implements OnDestroy {
    private _destroy$: Subject<any>;
    public showLoader: Observable<boolean> = of(false);

    constructor() {}

    get destroy$() {
        if (!this._destroy$) {
            this._destroy$ = new Subject();
        }
        return this._destroy$;
    }

    ngOnDestroy() {
        if (this._destroy$) {
            this._destroy$.next(true);
            this._destroy$.complete();
        }
    }


    public exportExcel(data: any) {
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(data);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, "products");
        });
    }

    public saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

public setLoader(showHideLoader: boolean): void {
        this.showLoader = of(showHideLoader)
}
}

