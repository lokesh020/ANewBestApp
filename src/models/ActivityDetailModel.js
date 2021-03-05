import MediaItemModel from './MediaItemModel'
class ActivityDetailModel {

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
    earnPoint;
    desc;
    totalDuration;
    
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
            this.earnPoint = props.earnPoint ?? 0;
            this.totalDuration = props.noOfDays ?? 0;
            this.isActive = props.isActive ?? false;
            this.wellnessSubCategoryTitle = props.wellnessSubCategoryTitle ?? "";
            this.cateogry = props.cateogry ?? "";
            this.actionTypeName = props.actionTypeName ?? "";
            this.media =  this.getMediaModelArr(props.media ?? [])
        }
    }

    getMediaModelArr = (mediaData) => {
        let mediaArr = []
        mediaData.forEach((element, index) => {
            const mediaItemModel = new MediaItemModel(element)
            mediaArr.push(mediaItemModel)
        });
        return mediaArr
    }

}


export default ActivityDetailModel
