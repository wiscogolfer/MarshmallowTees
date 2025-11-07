// Mad Libs Application
class MadLibsApp {
  constructor() {
    this.starterTemplates = [
      {
        id: 'launch-party',
        title: 'Launch Party Hype',
        description: 'Get excited about launching your new custom apparel!',
        story: 'Our {{adjective}} launch party was absolutely {{adjective}}! The {{plural-noun}} were {{verb-ing}} everywhere while {{celebrity-name}} wore our {{color}} {{noun}}. Everyone said the {{adjective}} designs were {{adjective}} and couldn\'t stop {{verb-ing}} about how {{adjective}} our {{plural-noun}} looked. The {{noun}} was {{verb-ing}} all night long!'
      },
      {
        id: 'custom-order',
        title: 'Custom Order Form',
        description: 'Fill out this hilarious custom apparel order!',
        story: 'Dear {{customer-name}}, We received your order for {{number}} {{adjective}} {{plural-noun}} in {{color}}. Your {{adjective}} design featuring a {{noun}} {{verb-ing}} on a {{adjective}} background is absolutely {{adjective}}! The {{plural-noun}} will be ready in {{number}} {{time-period}}. Please {{verb}} to our {{location}} to pick up your {{adjective}} package!'
      },
      {
        id: 'press-day',
        title: 'Press Day Adventure',
        description: 'A wild day at the Marshmallow Tees press!',
        story: 'Today at the {{noun}} press, everything went {{adjective}}! The {{plural-noun}} started {{verb-ing}} and the {{noun}} began to {{verb}} {{adverb}}. {{celebrity-name}} showed up wearing a {{adjective}} {{color}} {{noun}} and started {{verb-ing}} with the {{plural-noun}}. We had to {{verb}} the {{noun}} before it {{past-tense-verb}} the {{adjective}} {{plural-noun}}!'
      },
      {
        id: 'design-brainstorm',
        title: 'Design Brainstorm',
        description: 'Creative session for new apparel designs!',
        story: 'Our design team is {{verb-ing}} some {{adjective}} ideas! {{designer-name}} suggested a {{noun}} {{verb-ing}} on a {{color}} background. {{another-designer}} wants to add {{adjective}} {{plural-noun}} and {{number}} {{adjective}} {{noun}}. The client wants something {{adjective}} that will make people {{verb}} when they see it. Let\'s make this {{adjective}} design {{adverb}}!'
      },
      {
        id: 'weekend-pop-up',
        title: 'Weekend Pop-Up',
        description: 'Excitement at our weekend pop-up shop!',
        story: 'This {{time-of-day}} at our {{location}} pop-up shop, {{number}} {{adjective}} customers showed up! They were all {{verb-ing}} for our {{adjective}} {{plural-noun}}. One {{person-type}} bought {{number}} {{color}} {{plural-noun}} and another wanted a {{noun}} with {{adjective}} {{plural-noun}} on it. We {{past-tense-verb}} so much {{noun}} that we had to {{verb}} more {{plural-noun}} for tomorrow!'
      }
    ];
    
    this.currentTemplate = null;
    this.userTemplates = [];
    this.init();
  }

  init() {
    this.loadUserTemplates();
    this.bindEvents();
    this.renderTemplates();
  }

  loadUserTemplates() {
    const savedTemplates = localStorage.getItem('madlibs_user_templates');
    if (savedTemplates) {
      try {
        this.userTemplates = JSON.parse(savedTemplates);
      } catch (e) {
        console.error('Error loading user templates:', e);
        this.userTemplates = [];
      }
    }
  }

  saveUserTemplates() {
    try {
      localStorage.setItem('madlibs_user_templates', JSON.stringify(this.userTemplates));
    } catch (e) {
      console.error('Error saving user templates:', e);
    }
  }

  bindEvents() {
    // Template creation
    document.getElementById('create-template-btn').addEventListener('click', () => {
      this.showTemplateCreator();
    });

    document.getElementById('cancel-creator').addEventListener('click', () => {
      this.hideTemplateCreator();
    });

    document.getElementById('template-creator-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleTemplateCreation();
    });

    // Navigation
    document.getElementById('back-to-templates').addEventListener('click', () => {
      this.showTemplates();
    });

    document.getElementById('play-again').addEventListener('click', () => {
      this.playTemplate(this.currentTemplate);
    });

    document.getElementById('new-story').addEventListener('click', () => {
      this.showTemplates();
    });

    // Form submission
    document.getElementById('madlibs-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.generateStory();
    });
  }

  renderTemplates() {
    const container = document.getElementById('template-cards');
    container.innerHTML = '';

    // Render starter templates
    this.starterTemplates.forEach(template => {
      container.appendChild(this.createTemplateCard(template, false));
    });

    // Render user templates
    this.userTemplates.forEach(template => {
      container.appendChild(this.createTemplateCard(template, true));
    });
  }

  createTemplateCard(template, isUserTemplate) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 mb-4';
    
    const card = document.createElement('div');
    card.className = 'template-card';
    card.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${this.escapeHtml(template.title)}</h5>
          <p class="card-text">${this.escapeHtml(template.description)}</p>
          <div class="d-flex justify-content-between align-items-center">
            <button class="btn btn-primary play-template" data-template-id="${template.id}">
              <i class="fas fa-play"></i> Play
            </button>
            ${isUserTemplate ? `<button class="btn btn-danger delete-template" data-template-id="${template.id}"><i class="fas fa-trash"></i></button>` : ''}
          </div>
        </div>
      </div>
    `;

    // Bind events
    const playBtn = card.querySelector('.play-template');
    playBtn.addEventListener('click', () => {
      this.playTemplate(template);
    });

    if (isUserTemplate) {
      const deleteBtn = card.querySelector('.delete-template');
      deleteBtn.addEventListener('click', () => {
        this.deleteTemplate(template.id);
      });
    }

    col.appendChild(card);
    return col;
  }

  playTemplate(template) {
    this.currentTemplate = template;
    this.showPlayArea();
    this.renderInputForm(template);
  }

  renderInputForm(template) {
    const form = document.getElementById('madlibs-form');
    const placeholders = this.extractPlaceholders(template.story);
    
    document.getElementById('play-title').textContent = template.title;
    document.getElementById('play-description').textContent = template.description;

    form.innerHTML = '';
    
    placeholders.forEach((placeholder, index) => {
      const formGroup = document.createElement('div');
      formGroup.className = 'form-group';
      
      const label = document.createElement('label');
      label.setAttribute('for', `input-${index}`);
      label.textContent = `Enter a ${placeholder}:`;
      
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'form-control form-control-lg';
      input.id = `input-${index}`;
      input.name = placeholder;
      input.required = true;
      
      formGroup.appendChild(label);
      formGroup.appendChild(input);
      form.appendChild(formGroup);
    });

    // Focus first input
    if (placeholders.length > 0) {
      setTimeout(() => {
        document.getElementById('input-0').focus();
      }, 100);
    }
  }

  extractPlaceholders(story) {
    const regex = /\{\{([^}]+)\}\}/g;
    const placeholders = [];
    let match;
    
    while ((match = regex.exec(story)) !== null) {
      placeholders.push(match[1]);
    }
    
    return placeholders;
  }

  generateStory() {
    const form = document.getElementById('madlibs-form');
    const formData = new FormData(form);
    let story = this.currentTemplate.story;
    
    // Replace placeholders with user input
    for (let [placeholder, value] of formData.entries()) {
      const regex = new RegExp(`\\{\\{${placeholder}\\}\\}`, 'g');
      story = story.replace(regex, `<span class="madlib-token">${this.escapeHtml(value)}</span>`);
    }
    
    // Show results
    document.getElementById('completed-story').innerHTML = story;
    document.getElementById('input-form-container').style.display = 'none';
    document.getElementById('results-container').style.display = 'block';
    
    // Scroll to results
    document.getElementById('results-container').scrollIntoView({ behavior: 'smooth' });
  }

  showTemplateCreator() {
    document.getElementById('templates').style.display = 'none';
    document.getElementById('play-area').style.display = 'none';
    document.getElementById('creator-section').style.display = 'block';
    document.getElementById('creator-section').scrollIntoView({ behavior: 'smooth' });
  }

  hideTemplateCreator() {
    document.getElementById('creator-section').style.display = 'none';
    this.showTemplates();
  }

  handleTemplateCreation() {
    const title = document.getElementById('template-title').value.trim();
    const description = document.getElementById('template-description').value.trim();
    const story = document.getElementById('template-story').value.trim();
    const feedback = document.getElementById('validation-feedback');
    
    // Reset feedback
    feedback.style.display = 'none';
    feedback.textContent = '';
    
    // Validate
    if (!title || !description || !story) {
      feedback.textContent = 'Please fill in all fields.';
      feedback.style.display = 'block';
      return;
    }
    
    const placeholders = this.extractPlaceholders(story);
    if (placeholders.length === 0) {
      feedback.textContent = 'Your story must include at least one placeholder (e.g., {{noun}}).';
      feedback.style.display = 'block';
      return;
    }
    
    // Create template
    const template = {
      id: 'user_' + Date.now(),
      title: title,
      description: description,
      story: story
    };
    
    // Check for duplicate ID (unlikely but possible)
    if (this.userTemplates.some(t => t.id === template.id)) {
      template.id = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Save and render
    this.userTemplates.push(template);
    this.saveUserTemplates();
    
    // Reset form and show success
    document.getElementById('template-creator-form').reset();
    this.hideTemplateCreator();
    
    // Show success message
    const successAlert = document.createElement('div');
    successAlert.className = 'alert alert-success alert-dismissible fade show';
    successAlert.innerHTML = `
      Template "${this.escapeHtml(title)}" created successfully!
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    `;
    
    const container = document.querySelector('#templates .container-fluid');
    container.insertBefore(successAlert, container.firstChild);
  }

  deleteTemplate(templateId) {
    if (confirm('Are you sure you want to delete this template?')) {
      this.userTemplates = this.userTemplates.filter(t => t.id !== templateId);
      this.saveUserTemplates();
      this.renderTemplates();
    }
  }

  showTemplates() {
    document.getElementById('templates').style.display = 'block';
    document.getElementById('play-area').style.display = 'none';
    document.getElementById('creator-section').style.display = 'none';
    document.getElementById('templates').scrollIntoView({ behavior: 'smooth' });
  }

  showPlayArea() {
    document.getElementById('templates').style.display = 'none';
    document.getElementById('creator-section').style.display = 'none';
    document.getElementById('play-area').style.display = 'block';
    document.getElementById('input-form-container').style.display = 'block';
    document.getElementById('results-container').style.display = 'none';
    document.getElementById('play-area').scrollIntoView({ behavior: 'smooth' });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new MadLibsApp();
});