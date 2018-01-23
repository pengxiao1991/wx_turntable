// TypeScript file
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Rule = (function () {
    function Rule() {
        this.active = false;
        this.init();
    }
    Rule.prototype.init = function () {
        var self = this, ruleBtn = document.querySelector('.rule_btn'), ruleCover = document.querySelector('.rule_cover');
        if (!!ruleBtn && !!ruleCover) {
            ruleBtn.addEventListener('click', this.ruleBtnClick.bind(this));
            ruleCover.addEventListener('click', function () {
                if (self.active) {
                    self.ruleBtnClick();
                }
            });
        }
    };
    Rule.prototype.ruleBtnClick = function () {
        var self = this;
        if (!self.active) {
            self.openRuleBox();
        }
        else {
            self.closeRuleBox();
        }
    };
    Rule.prototype.openRuleBox = function () {
        var self = this;
        self.closeRuleBox();
        var ruleCover = document.querySelector('.rule_cover'), ruleBox = document.querySelector('.rule_box');
        self.active = true;
        ruleCover.style.display = 'block';
        ruleBox.style.transform = 'translate3d(0, -119.4444vw, 0)';
    };
    Rule.prototype.closeRuleBox = function () {
        var self = this, ruleCover = document.querySelector('.rule_cover'), ruleBox = document.querySelector('.rule_box');
        self.active = false;
        ruleCover.style.display = 'none';
        ruleBox.style.transform = 'translate3d(0, 0, 0)';
    };
    return Rule;
}());
__reflect(Rule.prototype, "Rule");
