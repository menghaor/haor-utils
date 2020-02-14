/**
 * 文件分片上传
 * @param file  
 * @return Promise
 */
export const fileUploadByShard = ({
	file
}) => {
	return new Promise((resolve, reject) => {
		resolve();
	})
}



/**
 * 文件下载
 * @param fileName 文件名称
 * @param content 文件流内容 || url
 * @param isStream 是否为流下载
 */
export const download = ({
	fileName,
	content
}) => {
	const blob = new Blob([content]);
	if ("download" in document.createElement("a")) {
		//非IE下载
		const elink = document.createElement("a");
		elink.download = fileName;
		elink.style.display = "none";
		elink.href = URL.createObjectURL(blob);
		elink.addEventListener("click", e => {
			e.stopImmediatePropagation();
		});
		document.body.appendChild(elink);
		elink.click();
		URL.revokeObjectURL(elink.href); //释放URL 对象
		document.body.removeChild(elink);
	} else {
		//IE10+下载
		navigator.msSaveBlob(blob, fileName);
	}
};

/**
 * 获取base64
 * @returns Promise
 */
export const getBase64 = file => {
	return new Promise(resolve => {
		const fr = new FileReader();
		fr.onload = e => {
			resolve(e.target.result);
		};
		fr.readAsDataURL(file);
	});
};
