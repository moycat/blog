(function($) {
  'use strict';

  /**
   * Search modal with custom index API
   * @constructor
   */
  var SearchModal = function() {
    this.$openButton = $('.open-search-modal');
    this.$searchModal = $('#open-search-modal');
    this.$closeButton = this.$searchModal.find('.close-button');
    this.$searchForm = $('#open-search-form');
    this.$searchInput = $('#open-search-input');
    this.$results = this.$searchModal.find('.results');
    this.$noResults = this.$searchModal.find('.no-result');
    this.$resultsCount = this.$searchModal.find('.results-count');
    this.apiBaseUrl = (window.searchApiBaseUrl || 'https://index.moy.cat').replace(/\/$/, '');
  };

  SearchModal.prototype = {
    /**
     * Run feature
     * @returns {void}
     */
    run: function() {
      var self = this;

      // open modal when open button is clicked
      self.$openButton.click(function() {
        self.open();
      });

      // open modal when `s` button is pressed
      $(document).keyup(function(event) {
        var target = event.target || event.srcElement;
        // exit if user is focusing an input or textarea
        var tagName = target.tagName.toUpperCase();
        if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
          return;
        }

        if (event.keyCode === 83 && !self.$searchModal.is(':visible')) {
          self.open();
        }
      });

      // close button when overlay is clicked
      self.$searchModal.click(function(e) {
        if (e.target === this) {
          self.close();
        }
      });

      // close modal when close button is clicked
      self.$closeButton.click(function() {
        self.close();
      });

      // close modal when `ESC` button is pressed
      $(document).keyup(function(e) {
        if (e.keyCode === 27 && self.$searchModal.is(':visible')) {
          self.close();
        }
      });

      // send search when form is submitted
      self.$searchForm.submit(function(event) {
        event.preventDefault();
        self.search(self.$searchInput.val());
      });

      // send search when input value changes (debounced)
      self.searchDebounced = self.debounce(function() {
        self.search(self.$searchInput.val());
      }, 250);

      self.$searchInput.on('input', function() {
        self.searchDebounced();
      });
    },

    /**
     * Open search modal and display overlay
     * @returns {void}
     */
    open: function() {
      this.showSearchModal();
      this.showOverlay();
      this.$searchInput.focus();
    },

    /**
     * Close search modal and overlay
     * @returns {void}
     */
    close: function() {
      this.hideSearchModal();
      this.hideOverlay();
      this.$searchInput.blur();
    },

    search: function(search) {
      var self = this;
      var query = (search || '').trim();

      if (!query) {
        self.showResults([]);
        self.showResultsCount(0);
        return;
      }

      fetch(this.apiBaseUrl + '/v1/search?q=' + encodeURIComponent(query))
        .then(function(response) {
          return response.json().then(function(payload) {
            if (!response.ok) {
              throw new Error((payload && payload.error && payload.error.message) || 'search request failed');
            }
            return payload;
          });
        })
        .then(function(payload) {
          var hits = Array.isArray(payload && payload.hits) ? payload.hits : [];
          self.showResults(hits);
          self.showResultsCount(hits.length);
        })
        .catch(function() {
          self.showResults([]);
          self.showResultsCount(0);
        });
    },

    /**
     * Display results
     * @param {Array} posts
     * @returns {void}
     */
    showResults: function(posts) {
      var html = '';
      posts.forEach(function(post) {
        var postUrl = post.url || post.link || post.permalink || '#';
        var snippet = post.snippet || post.excerpt || post.excerptStrip || '';
        var escapedSnippet = String(snippet)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\"/g, '&quot;')
          .replace(/'/g, '&#39;')
          .replace(/\r\n?|\n/g, '\n');
        var paragraphSnippet = escapedSnippet
          .split('\n')
          .map(function(line) {
            return line.trim();
          })
          .filter(function(line) {
            return line.length > 0;
          })
          .map(function(line) {
            return '<p>' + line + '</p>';
          })
          .join('');

        html += '<div class="media">';
        if (post.thumbnailImageUrl) {
          html += '<div class="media-left">';
          html += '<a class="link-unstyled" href="' + postUrl + '">';
          html += '<img class="media-image" ' +
            'src="' + post.thumbnailImageUrl + '" ' +
            'width="90" height="90"/>';
          html += '</a>';
          html += '</div>';
        }

        html += '<div class="media-body">';
        html += '<a class="link-unstyled" href="' + postUrl + '">';
        html += '<h2 class="media-heading">' + (post.title || '') + '</h2>';
        html += '</a>';
        html += '<div class="media-content hide-xs font-body">' + paragraphSnippet + '</div>';
        html += '</div>';
        html += '<div style="clear:both;"></div>';
        html += '<hr>';
        html += '</div>';
      });
      this.$results.html(html);
    },

    /**
     * Show search modal
     * @returns {void}
     */
    showSearchModal: function() {
      this.$searchModal.fadeIn();
    },

    /**
     * Hide search modal
     * @returns {void}
     */
    hideSearchModal: function() {
      this.$searchModal.fadeOut();
    },

    /**
     * Display messages and counts of results
     * @param {Number} count
     * @returns {void}
     */
    showResultsCount: function(count) {
      var string = '';
      if (count < 1) {
        string = this.$resultsCount.data('message-zero');
        this.$noResults.show();
      }
      else if (count === 1) {
        string = this.$resultsCount.data('message-one');
        this.$noResults.hide();
      }
      else if (count > 1) {
        string = this.$resultsCount.data('message-other').replace(/\{n\}/, count);
        this.$noResults.hide();
      }
      this.$resultsCount.html(string);
    },

    /**
     * Show overlay
     * @returns {void}
     */
    showOverlay: function() {
      $('body').append('<div class="overlay"></div>');
      $('.overlay').fadeIn();
      $('body').css('overflow', 'hidden');
    },

    /**
     * Hide overlay
     * @returns {void}
     */
    hideOverlay: function() {
      $('.overlay').fadeOut(function() {
        $(this).remove();
        $('body').css('overflow', 'auto');
      });
    },

    debounce: function(func, wait) {
      var timeoutId;

      return function() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(func, wait);
      };
    }
  };

  $(document).ready(function() {
    var searchModal = new SearchModal();
    searchModal.run();
  });
})(jQuery);
