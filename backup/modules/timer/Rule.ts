// TypeScript file

class Rule {
    public active:boolean = false;
    public constructor() {
		this.init();
	}

    private init() {
        var self = this,
            ruleBtn = document.querySelector('.rule_btn'),
            ruleCover = document.querySelector('.rule_cover');
        if (!!ruleBtn && !!ruleCover) {
            ruleBtn.addEventListener('click', this.ruleBtnClick.bind(this))
            ruleCover.addEventListener('click', function () {
                if(self.active) {
                    self.ruleBtnClick();
                }
            })
        }
    }

    private ruleBtnClick() {
        var self = this;
        if(!self.active) {
            self.openRuleBox();
        } else {
            self.closeRuleBox();
        }
    }

    private openRuleBox() {
        var self = this;
        self.closeRuleBox();
        var ruleCover = document.querySelector('.rule_cover') as HTMLElement,
            ruleBox = document.querySelector('.rule_box') as HTMLElement;
        self.active = true;
    
        ruleCover.style.display = 'block';
        ruleBox.style.transform = 'translate3d(0, -119.4444vw, 0)';
    }

    public closeRuleBox() {
        var self = this,
            ruleCover = document.querySelector('.rule_cover') as HTMLElement,
            ruleBox = document.querySelector('.rule_box') as HTMLElement;
        self.active = false;
        ruleCover.style.display = 'none';
        ruleBox.style.transform = 'translate3d(0, 0, 0)';
    }
}