import { Query, Document } from "mongoose";

// API features class
export default class APIFeatures<T extends Document> {
  reqQuery: RequestQuery = {};
  dbQuery: Query<T[], T>;

  constructor(dbQuery: Query<T[], T>, reqQuery?: RequestQuery) {
    this.dbQuery = dbQuery;
    if (reqQuery) {
      this.reqQuery = reqQuery;
    }
  }

  // Filter
  filter(): APIFeatures<T> {
    let queryObj = { ...this.reqQuery };
    const excludedFields = ["page", "limit", "sort", "fields"];

    // Remove excluded fields from "queryObj"
    excludedFields.forEach(function (el) {
      delete queryObj[el];
    });

    // Add/concat the "$" symbol to filter options (gte, gte, lte, lt)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, function (match) {
      return `$${match}`;
    });

    // Parse the string and pass it to the "find()" method in "dbQuery"
    queryObj = JSON.parse(queryStr);
    this.dbQuery = this.dbQuery.find(queryObj);

    return this; // Return the document
  }

  // Sort
  sort(): APIFeatures<T> {
    if (this.reqQuery.sort) {
      const sortValue: string = this.reqQuery.sort;
      this.dbQuery.sort(sortValue.split(",").join(" "));
    } else {
      this.dbQuery.sort("-createdAt");
    }
    return this;
  }

  // Project
  project(): APIFeatures<T> {
    if (this.reqQuery.fields) {
      const projectValue = this.reqQuery.fields;
      this.dbQuery.select(projectValue.split(",").join(" "));
    } else {
      this.dbQuery.select("-_v");
    }
    return this;
  }

  // Paginate
  paginate(): APIFeatures<T> {
    const page = this.reqQuery.page || 1;
    const limit = this.reqQuery.limit || 10;
    const skip = (page - 1) * limit;
    this.dbQuery.skip(skip).limit(limit);
    return this;
  }
}
