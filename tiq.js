/**
 * tiq - Tag everything.
 * @module tiq
 */

/**
 * Module dependencies.
 */
var _ = require('lodash');

exports = module.exports = {
  'associate': associate,
  'describe': describe
}

/**
 * Associate a collection of tokens with a collection of tags.
 *
 * @param {Array} tokens
 * @param {Array} tags
 * @param {String} [ns=''] - Namespace to prefix all tags and tokens with.
 * @param {Object} [data={}]
 */
function associate(tokens, tags, ns, data) {
  if (!tokens.length || !tags.length) {
    return;
  }

  ns = ns || '';
  data = data || {};

  var key = '';
  for (var i = 0; i < tokens.length; i++) {
    key = ns ? ns + ':::' + tokens[i] : tokens[i];
    data[key] = _.union(data[key] || [], tags);
  }

  for (var i = 0; i < tags.length; i++) {
    key = ns ? ns + ':::' + tags[i] : tags[i];
    data[key] = _.union(data[key] || [], tokens);
  }
  return data;
}

/**
 * Get the tags associated with the given tokens.
 *
 * @param {Array} tokens
 * @param {String} [ns=''] - Namespace to prefix all tokens with.
 * @param {Object} [data={}]
 */
function describe(tokens, ns, data) {
  if (!tokens.length) {
    return;
  }

  ns = ns || '';
  data = data || {};

  var tags = [];
  // Get all tags associated with each token
  for (var i = 0; i < tokens.length; i++) {
    key = ns ? ns + ':::' + tokens[i] : tokens[i];
    tags.push(data[key] || []);
  }

  // Only unique tags
  return _.intersection.apply(this, tags);
}
