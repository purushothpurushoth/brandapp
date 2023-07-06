
export interface IEmployer {
  emailIds: string;
  companyName: string;
  companyReviewURLOnGlassdoor: string;
  ratingThreshold: number;
  frequencyOfEmailInDays: number;
}

export interface ITableData {
  skeletonLoaderList: number[];
  searchTotalCount: number;
  startRowIndex: number;
  searchText: string;
  isTableLoading: boolean;
  pageSize: number;
}
