class ActivityModel {

    createdOn;
    id;
    actionTypeId;
    duration;
    wellnessSubCategoryId;
    subCategory;
    category;
    thumbnail;
    title;
    rating;
    desc;
    constructor(props) {
        if (props) {
            this.createdOn = props.createdOn ?? ""
            this.id = props.id ?? 0;
            this.actionTypeId = props.actionTypeId ?? 0;
            this.duration = props.duration ?? 0;
            this.wellnessSubCategoryId = props.wellnessSubCategoryId ?? 0;
            this.subCategory = props.subCategory ?? "";
            this.category = props.category ?? "";
            this.thumbnail = props.thumbnail ?? "";
            this.title = props.title ?? "";
            this.rating = props.rating ?? 0;
            this.desc = props.description ?? "";
        }
    }

}


export default ActivityModel