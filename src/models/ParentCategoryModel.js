class ParentCategoryModel {

    createdOn;
    id;
    isActive;
    parentCategoryId;
    parentCategory;
    thumbnail;
    title;
    backGroundColor;

    constructor(props) {
        if (props) {
            this.createdOn = props.createdOn ?? ""
            this.id = props.id ?? 0;
            this.isActive = props.isActive ?? true;
            this.parentCategoryId = props.parentCategoryId ?? 0;
            this.parentCategory = props.parentCategory ?? "";
            this.thumbnail = props.thumbnail ?? "";
            this.title = props.title ?? "";
            this.backGroundColor = props.backGroundColor ?? "white";
        }
    }

}

export default ParentCategoryModel;
