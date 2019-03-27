String.prototype.toNumber = function() {
    return Number(this.replace(/ /g, '').match('[0-9\.-]+'));
};