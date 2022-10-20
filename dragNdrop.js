window.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[draggable="true"]').forEach(function(element) {
        element.addEventListener('dragstart', function(e) {
            this.classList.add('drag-bg');

            dragStartElement = this;
            
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.dataset.order);
        });

        element.addEventListener('dragover', function(e) {
            e.preventDefault();
            return false;
        });

        element.addEventListener('dragend', function(e) {
            this.classList.remove('drag-bg');
            document.querySelectorAll('[draggable="true"]').forEach(el => el.classList.remove('drag-hover'));
        });

        element.addEventListener('drop', function(e) {
            e.stopPropagation();

            if (dragStartElement !== this) {
                dragStartElement.dataset.order = this.dataset.order;
                this.dataset.order = e.dataTransfer.getData('text/html');
            }
            return false;
        });
    })
})