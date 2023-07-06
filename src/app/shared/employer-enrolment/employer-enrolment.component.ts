import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  CONSTANTS_UPLOAD_EXCEL_MAX_SIZE,
  EMPLOYER_TABLE_COLUMNS,
  ERROR_MESSAGE,
  MODAL_TYPE,
  RESPONSE_STATUS,
  RESPONSE_STATUS_CODE,
  SUCCESS_MESSAGE,
} from 'src/app/app.constants';
import { MultiFieldsModalComponent } from 'src/app/custom-components/multi-fields-modal/multi-fields-modal.component';
import {
  IEmployer,
  ITableData,
} from 'src/app/interfaces/empoyer-enrolment.interface';
import { EmployerEntrolmentService } from 'src/app/service/employer-enrolment/employer-entrolment.service';
import { ToastService } from 'src/app/service/toast-service/toast.service';
import {
  convertToIEmployer,
  generateNumberArray,
} from 'src/app/utils/app.utils';
import {
  csvFileToJSON,
  excelFiletoJSON,
} from 'src/app/utils/file-upload.utils';
import { isValidEmail } from 'src/app/utils/validation.utils';
import {
  BULK_UPLOAD_MAX_COUNT,
  EMPLOYER_TABLE_PAGE_SIZE,
} from 'src/environments/environment';
import { utils as XLSXUtils, read as readXLSX } from 'xlsx';

@Component({
  selector: 'glasstop-employer-enrolment',
  templateUrl: './employer-enrolment.component.html',
  styleUrls: ['./employer-enrolment.component.scss'],
})
export class EmployerEnrolmentComponent implements OnInit {
  public isUploadSectionFocused = false;
  public modalRef?: BsModalRef | null;
  public tableColumns = EMPLOYER_TABLE_COLUMNS;
  private apiAuthToken: string = '';
  public tableData: ITableData = {
    skeletonLoaderList: generateNumberArray(5),
    searchTotalCount: 0,
    startRowIndex: 0,
    searchText: '',
    isTableLoading: false,
    pageSize: EMPLOYER_TABLE_PAGE_SIZE,
  };
  public employerList: IEmployer[] = [];
  public masteremployerList: IEmployer[] = [];
  constructor(
    private toastService: ToastService,
    private bsModalService: BsModalService,
    private employerService: EmployerEntrolmentService,
    private activatedRoute: ActivatedRoute
  ) {}

  instance = this;

  ngOnInit(): void {
    this.activatedRoute.data.subscribe( data => 
      localStorage.setItem("token", data['auth'].token)
      );
      // this.loadEmployerList();
  }

  /**
   * @description Method to load employer list
   */
  public loadEmployerList() {
    this.employerService.getEmployers().subscribe((employers: IEmployer[]) => {
      if (employers?.length) {
        this.employerList = employers.map((emp: any) => {
          emp.isSelected = false;
          return emp;
        });
      }
      this.masteremployerList = [...this.employerList];
    });
  }

  /**
   * @description: Method to apply background color effect on upload section when upload button click.
   */
  public focusUploadSection() {
    this.isUploadSectionFocused = true;
    setTimeout(() => {
      this.isUploadSectionFocused = false;
    }, 2000);
  }

  /**
   * @description: Method to apply drag over when upload file.
   */
  public onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  /**
   * @description: Method to apply drag over when upload file and will call file chang method.
   */
  public onDropSuccess(event: DragEvent) {
    event.preventDefault();
    let dragFileList = event.dataTransfer?.files;
    if (dragFileList && dragFileList.length < 2) {
      this.processFileUpload(dragFileList);
    }
  }

  /**
   * @description: Method to apply for file validation like size, format and convert to
   * json format from uploaded excel/csv file.
   */
  private async processFileUpload(files: FileList) {
    if (files.length) {
      const file = files[0];
      let type = file.name.split('.').pop();
      if (file.size < CONSTANTS_UPLOAD_EXCEL_MAX_SIZE) {
        if (type && ['xlsx', 'xls', 'csv'].includes(type)) {
          try {
            const employerList: Array<IEmployer> =
              type === 'csv'
                ? await csvFileToJSON(file)
                : await excelFiletoJSON(file);
            if (employerList.length > BULK_UPLOAD_MAX_COUNT) {
              this.toastService.showErrorToast(
                ERROR_MESSAGE.EXCEL_MAX_ROWS_ERR
              );
            } else {
              const fileName =
                file?.name?.substring(0, file?.name?.lastIndexOf('.')) ||
                file?.name;
              this.confirmFileUpload(fileName, employerList);
            }
          } catch (e) {
            this.toastService.showErrorToast(ERROR_MESSAGE.GENERIC);
          }
        } else {
          this.toastService.showErrorToast(ERROR_MESSAGE.INVALID_FILE_TYPE);
        }
      } else {
        this.toastService.showErrorToast(ERROR_MESSAGE.FILE_SIZE);
      }
    }
  }

  /**
   * @description Perform Validation for every employer field
   * @param employers emplyer List
   * @returns
   */
  private validateEmployerFields(employers: IEmployer[]) {
    const validationErrors: {
      employer: IEmployer;
      validationMessage: string;
    }[] = [];
    const usedCompanyNames = new Set<string>();

    for (const employer of employers) {
      // emailIds Validation
      const isInvalidEmaild = employer.emailIds.split(',').some((emailId) => {
        !isValidEmail(emailId.trim()) &&
          console.log('invalid email ====>', emailId, employer);
        return !isValidEmail(emailId.trim());
      });
      isInvalidEmaild &&
        validationErrors.push({
          employer,
          validationMessage: `Invalid emailIds: ${employer.emailIds}`,
        });

      // companyName Validation
      if (employer.companyName.trim() === '') {
        validationErrors.push({
          employer,
          validationMessage: `Empty companyName`,
        });
      } else if (usedCompanyNames.has(employer.companyName)) {
        validationErrors.push({
          employer,
          validationMessage: `Duplicate companyName: ${employer.companyName}`,
        });
      }

      // frequencyOfEmailInDays Validation
      if (employer.frequencyOfEmailInDays <= 0) {
        validationErrors.push({
          employer,
          validationMessage: `Invalid frequencyOfEmailInDays: ${employer.frequencyOfEmailInDays}`,
        });
      }

      // ratingThreshold Validation
      if (employer.ratingThreshold <= 0 || employer.ratingThreshold >= 5) {
        validationErrors.push({
          employer,
          validationMessage: `Invalid ratingThreshold: ${employer.ratingThreshold}`,
        });
      }

      // companyReviewURLOnGlassdoor validation
      if (
        !employer.companyReviewURLOnGlassdoor.startsWith(
          'https://glassdoor.com/Reviews/'
        ) ||
        (!employer.companyReviewURLOnGlassdoor.endsWith('.htm') &&
          !employer.companyReviewURLOnGlassdoor.endsWith('.html'))
      ) {
        validationErrors.push({
          employer,
          validationMessage: `Invalid companyReviewURLOnGlassdoor: ${employer.companyReviewURLOnGlassdoor}`,
        });
      }

      usedCompanyNames.add(employer.companyName);
    }

    return validationErrors;
  }

  /**
   * @description Method to show confirmation modal before file upload
   * @param {string} fileName
   */
  private confirmFileUpload(fileName: string, employerList: IEmployer[]) {
    if (employerList && employerList.length) {
      // Generate employer list payload from file list
      employerList = employerList.map((_employer) => {
        return {
          emailIds: _employer.emailIds || [],
          companyName: _employer.companyName || '',
          companyReviewURLOnGlassdoor:
            _employer.companyReviewURLOnGlassdoor || '',
          ratingThreshold: _employer.ratingThreshold || 0,
          frequencyOfEmailInDays: _employer.frequencyOfEmailInDays || 0,
        } as IEmployer;
      });
      const validationErrors = this.validateEmployerFields(employerList);

      // Open confirmation dialog
      let modalOptions = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: validationErrors.length
          ? 'modal-lg upload-employer-error'
          : 'modal-lg modal-dialog-centered',
        initialState: {},
      };
      if (validationErrors.length) {
        modalOptions.initialState = {
          modalType: MODAL_TYPE.UPLOAD_EMPLOYERS_ERROR_MODAL,
          toast: {
            type: RESPONSE_STATUS.ERROR,
            message: `<div class="fs-12"><span class="fw-600">We couldn't upload file due to invalid input data.<br>
                    ${validationErrors.length} employee(s) data are invalid</span>, please Correct the error(s) and reupload the file</div>`,
            errorData: validationErrors,
          },
        };
      } else {
        modalOptions.initialState = {
          modalType: MODAL_TYPE.UPLOAD_CONFIRMATION_MODAL,
          fileName,
          employeeList: employerList,
          tableColumns: this.tableColumns,
        };
      }
      this.modalRef = this.bsModalService.show(
        MultiFieldsModalComponent,
        modalOptions
      );
      this.modalRef.content.subject.subscribe(
        (response: { status: boolean }) => {
          if (response && response.status) {
            !validationErrors.length && this.saveEmployerList(employerList);
          }
        }
      );
    } else {
      this.toastService.showErrorToast(ERROR_MESSAGE.EMPTY_FILE_ERR);
    }
  }

  /**
   * @description Saves the employer list and after saving loads the employees on paginated view
   * @param fileName
   * @param employerList
   */
  private saveEmployerList(employerList: any) {
    this.tableData = {
      ...this.tableData,
      isTableLoading: true,
      skeletonLoaderList: generateNumberArray(this.employerList.length),
    };
    this.employerService.saveEmployers(employerList).subscribe((res) => {
      if (res.statusCode === RESPONSE_STATUS_CODE.SUCCESS) {
        this.toastService.showSuccessToast(SUCCESS_MESSAGE.EMPLOYER_SAVE);
        this.masteremployerList = [...this.masteremployerList, ...employerList];
        this.loadPaginatedEmployerList(0, [...this.masteremployerList]);
      } else {
        this.toastService.showErrorToast(ERROR_MESSAGE.EMPLOYER_SAVE);
      }
    });
  }

  /**
   * @description Saves a single employer
   * @param employer
   */
  public saveEmployer(employer: { [key: string]: string }) {
    const parsedEmployer = convertToIEmployer(employer);
    const validationErrors = this.validateEmployerFields([parsedEmployer]);
    if (validationErrors.length) {
      this.toastService.showErrorToast(validationErrors[0].validationMessage);
    } else {
      this.saveEmployerList([employer]);
    }
  }

  /**
   * @description Method to Upload File
   * @param event File Upload Event
   */
  public uploadFile(event: any) {
    event?.target?.files && this.processFileUpload(event.target.files);
    event.target.value = '';
  }

  /**
   * @description Loads Employers on Search
   * @param {string} searchText
   */
  public loadEmployersOnSearch(searchText: string = '') {
    this.tableData = {
      ...this.tableData,
      isTableLoading: true,
      startRowIndex: 0,
      searchText,
    };
    let employerList = this.masteremployerList.filter(
      (employer) =>
        employer?.companyName?.includes(searchText) ||
        employer?.emailIds?.split(',').some((str) => str.includes(searchText))
    );
    !searchText && (employerList = [...this.masteremployerList]);
    this.loadPaginatedEmployerList(0, employerList);
  }

  /**
   * @description Method to load employer list on pagination
   * @param {number} startIndex
   */
  public loadEmployerListOnPagination(startRowIndex: number = 0) {
    this.tableData = {
      ...this.tableData,
      isTableLoading: true,
    };
    console.log('startRowIndex', startRowIndex);
    this.loadPaginatedEmployerList(startRowIndex, [...this.masteremployerList]);
  }

  /**
   * @description Paginates the employers
   * @param pageNumber
   * @param employerList
   */
  private loadPaginatedEmployerList(
    pageNumber: number,
    employerList: IEmployer[]
  ) {
    const startIndex = pageNumber * this.tableData.pageSize;
    const endIndex = startIndex + this.tableData.pageSize;
    this.employerList = employerList.slice(startIndex, endIndex);
    this.tableData = {
      ...this.tableData,
      isTableLoading: false,
      startRowIndex: pageNumber,
      searchTotalCount: this.masteremployerList.length,
    };
  }
}
