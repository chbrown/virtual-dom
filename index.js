var diff = require("./vtree/diff")
var patch = require("./vdom/patch")
var h = require("./virtual-hyperscript/index")
var create = require("./vdom/create-element")
var VNode = require('./vnode/vnode')
var VText = require('./vnode/vtext')

module.exports = {
    diff: diff,
    patch: patch,
    h: h,
    create: create,
    VNode: VNode,
    VText: VText
}
