class Header {
	public constructor() {
		document.querySelector('.fm-header-lift').addEventListener('click', function () {
			console.log(Native);
			egret.ticker.pause();
			setTimeout(() => {
				Native.finishPage();
			}, 50);
		})
	}
}