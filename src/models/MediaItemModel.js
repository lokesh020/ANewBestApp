import Images from '../assets/images/'
class MediaItemModel {

    activityDetailId;
    mediaTypeId;
    mediaName;
    id;
    title;
    fileName;
    fileType;
    
    constructor(props) {

        if (props) {
            this.activityDetailId = props.activityDetailId ?? 0
            this.mediaTypeId = props.mediaTypeId ?? 0;
            this.mediaName = props.mediaName ?? "";
            this.id = props.id ?? 0;
            this.title = props.title ?? "";
            this.fileName = this.getFileName(props.fileName)
            this.fileType = this.getFileExtension(props.fileName)
            this.fileUrl = props.fileName ?? ""
        }
    }

    getMediaIconSrc = () => {
        let iconSrc = this.mediaTypeId == 1 ? Images.pdf_icon : this.mediaTypeId == 2 ? Images.video_icon : Images.audio_icon
        return iconSrc
    }

    getMediaType = () => {
        let type = this.mediaTypeId == 1 ? "pdf" : this.mediaTypeId == 2 ? "video" : "audio"
        return type
    }

    getFileName = (url) => {
        if (url) {
            var m = url.toString().match(/.*\/(.+?)\./);
            if (m && m.length > 1) {
                return m[1];
            }
        }
        return ""
    }

    getFileExtension = (url) => {
        if (url){
            return url.split(/[#?]/)[0].split('.').pop().trim();
        }
        return ""
    }

}


export default MediaItemModel
