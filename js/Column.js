function Column(id, name) {
	var self = this;
	
	this.id = id;
    this.name = name || 'No name given';
	this.element = createColumn();

	function createColumn() {
		// TWORZENIE NOWYCH WĘZŁÓW
		var column = $('<div class="column" id="'+ self.id +'"></div>');
		var columnTitle = $('<h2 class="column-title">' + self.name + '</h2>');
		var columnCardList = $('<ul class="card-list"></ul>');
		var columnDelete = $('<button class="btn-delete">x</button>');
		var columnAddCard = $('<button class="column-add-card">Dodaj kartę</button>');
		var columnRenameBtn = $('<button class="btn-rename-column">Rename column</button>')
		
		// PODPINANIE ODPOWIEDNICH ZDARZEŃ POD WĘZŁY
		columnDelete.click(function() {
			self.deleteColumn();
		});
		
		columnAddCard.click(function(event) {
			var cardName = prompt("Enter the name of the card");
			event.preventDefault();
			$.ajax({
				url: baseUrl + '/card',
				method: 'POST',
				data: {
					name: cardName,
					bootcamp_kanban_column_id: self.id
				},
				
				success: function(response) {
					var card = new Card(response.id, cardName, self.id);
					self.createCard(card);
				}
			});
		});

		columnRenameBtn.click(function(){
			self.renameColumn();
		})
			
			// KONSTRUOWANIE ELEMENTU KOLUMNY
		column.append(columnTitle)
			.append(columnDelete)
			.append(columnAddCard)
			.append(columnCardList)
			.append(columnRenameBtn);
			return column;
		}
	}
Column.prototype = {
	createCard: function(card) {
	  this.element.children('ul').append(card.element);
	},
	deleteColumn: function() {
		var self = this;
		$.ajax({
		  url: baseUrl + '/column/' + self.id,
		  method: 'DELETE',
		  success: function(response){
			self.element.remove();
		  }
		});
	},
	renameColumn: function() {
		var self = this;
		var columnName = prompt("Enter the name of the column");
		$.ajax({
			url: baseUrl + '/column/' + self.id,
			method: 'PUT',
			data: {
				name: columnName,
			},
			success: function(response){
				var columnTitle = $(self.element[0].children[0]);
				columnTitle.text(columnName);
			}
		})
	}
};