const userInput = document.getElementById('userInput');
const outputText = document.getElementById('outputText');
const cursor = document.getElementById('cursor');
const convertBtn = document.getElementById('convertBtn');
const copyBtn = document.getElementById('copyBtn');
const saveBtn = document.getElementById('saveBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const promptStyle = document.getElementById('promptStyle');
const themeToggle = document.getElementById('themeToggle');
const customTemplateContainer = document.getElementById('customTemplateContainer');
const customTemplate = document.getElementById('customTemplate');
const showExamples = document.getElementById('showExamples');
const examplesPopover = document.getElementById('examplesPopover');
const historySection = document.getElementById('historySection');
const historyItems = document.getElementById('historyItems');
const clearHistory = document.getElementById('clearHistory');

let isTyping = false;
let currentOutput = "";

// Initialize theme from localStorage
function initTheme() {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
}

// Toggle dark/light mode
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
  
  themeToggle.innerHTML = isDarkMode ? 
    '<i class="fas fa-sun"></i>' : 
    '<i class="fas fa-moon"></i>';
});

// Show/hide custom template based on selection
promptStyle.addEventListener('change', () => {
  if (promptStyle.value === 'custom') {
    customTemplateContainer.style.display = 'block';
  } else {
    customTemplateContainer.style.display = 'none';
  }
});

// Show/hide examples
showExamples.addEventListener('click', () => {
  if (examplesPopover.style.display === 'block') {
    examplesPopover.style.display = 'none';
  } else {
    examplesPopover.style.display = 'block';
  }
});

// Close examples when clicking outside
document.addEventListener('click', (e) => {
  if (!showExamples.contains(e.target) && !examplesPopover.contains(e.target)) {
    examplesPopover.style.display = 'none';
  }
});

// Use example
document.querySelectorAll('.example-item').forEach(item => {
  item.addEventListener('click', () => {
    userInput.value = item.getAttribute('data-example');
    examplesPopover.style.display = 'none';
  });
});

// Generate professional prompt based on user input and selected style
function generateProfessionalPrompt(input, style) {
  const inputText = input.trim();
  if (!inputText) return "Please provide some text to convert into a professional prompt.";
  
  // Custom template handling
  if (style === 'custom') {
    const template = customTemplate.value || "Create the following: {input}";
    return template.replace('{input}', inputText);
  }
  
  let prompt = "";
  
  // Extract key elements from the input
  const words = inputText.toLowerCase().split(' ');
  const hasSubject = words.some(word => ['logo', 'image', 'design', 'write', 'create', 'generate', 'develop'].includes(word));
  
  // Basic structure detection
  const isForImage = words.some(word => ['logo', 'image', 'picture', 'photo', 'design', 'graphic', 'illustration', 'draw'].includes(word));
  const isForText = words.some(word => ['write', 'text', 'essay', 'article', 'blog', 'story', 'script', 'content'].includes(word));
  const isForCode = words.some(word => ['code', 'program', 'app', 'application', 'website', 'function', 'algorithm'].includes(word));
  
  // Enhanced style-specific formatting with more specialized templates
  switch(style) {
    case 'detailed':
      prompt = generateDetailedPrompt(inputText, isForImage, isForText, isForCode);
      break;
    case 'midjourney':
      prompt = generateImagePrompt(inputText);
      break;
    case 'chatgpt':
      prompt = generateChatGPTPrompt(inputText, isForImage, isForText, isForCode);
      break;
    case 'professional':
      prompt = generateProfessionalBusinessPrompt(inputText);
      break;
    case 'creative':
      prompt = generateCreativePrompt(inputText);
      break;
    default:
      prompt = generateDetailedPrompt(inputText, isForImage, isForText, isForCode);
  }
  
  return prompt;
}

// Enhanced detailed prompt generator with more intelligence
function generateDetailedPrompt(input, isForImage, isForText, isForCode) {
  let objective = "Create";
  let domain = "content";
  
  // More intelligent detection of task type
  if (isForImage) {
    objective = "Design";
    domain = "visual asset";
    
    if (input.toLowerCase().includes('logo')) {
      domain = "logo";
    } else if (input.toLowerCase().includes('banner') || input.toLowerCase().includes('ad')) {
      domain = "marketing visual";
    } else if (input.toLowerCase().includes('ui') || input.toLowerCase().includes('interface')) {
      domain = "user interface";
    }
  }
  
  if (isForText) {
    objective = "Write";
    domain = "text content";
    
    if (input.toLowerCase().includes('blog')) {
      domain = "blog post";
    } else if (input.toLowerCase().includes('article')) {
      domain = "article";
    } else if (input.toLowerCase().includes('story')) {
      domain = "story";
    } else if (input.toLowerCase().includes('email') || input.toLowerCase().includes('newsletter')) {
      domain = "email content";
    }
  }
  
  if (isForCode) {
    objective = "Develop";
    domain = "code";
    
    if (input.toLowerCase().includes('website')) {
      domain = "website";
    } else if (input.toLowerCase().includes('app')) {
      domain = "application";
    } else if (input.toLowerCase().includes('function')) {
      domain = "function";
    }
  }
  
  return `${objective} a high-quality ${domain} with the following specifications:

OBJECTIVE: ${input}

DETAILS:
- Ensure professional quality and attention to detail
- Incorporate modern best practices and standards
- Optimize for clarity and effectiveness

ADDITIONAL REQUIREMENTS:
- Make it visually appealing and well-structured
- Ensure it communicates the core message effectively
- Focus on creating a memorable and impactful result

Please provide a detailed explanation of your creative process and reasoning behind key decisions.`;
}

// Enhanced image prompt generator with more specific styling options
function generateImagePrompt(input) {
  // Detect specific style preferences
  let styleType = "professional, high-resolution, photorealistic";
  let lighting = "dramatic studio lighting with soft highlights";
  let mood = "inspiring, impressive, attention-grabbing";
  
  if (input.toLowerCase().includes('minimalist') || input.toLowerCase().includes('simple')) {
    styleType = "minimalist, clean, elegant";
    lighting = "soft, even lighting with subtle shadows";
    mood = "calm, refined, sophisticated";
  } else if (input.toLowerCase().includes('vibrant') || input.toLowerCase().includes('colorful')) {
    styleType = "vibrant, colorful, energetic";
    lighting = "bright, high-contrast lighting";
    mood = "dynamic, playful, exciting";
  } else if (input.toLowerCase().includes('vintage') || input.toLowerCase().includes('retro')) {
    styleType = "vintage, retro, nostalgic";
    lighting = "warm, filtered lighting with gentle fade";
    mood = "nostalgic, comforting, timeless";
  }
  
  return `Create a stunning visual with the following elements: ${input}

Style: ${styleType}
Lighting: ${lighting}
Perspective: optimal viewing angle to showcase all elements
Mood: ${mood}
Technical details: 8K resolution, intricate details, perfect composition

Additional elements: subtle complementary background, balanced color harmony, professional presentation`;
}

function generateChatGPTPrompt(input, isForImage, isForText, isForCode) {
  let rolePrefix = "You are an expert";
  let taskType = "";
  
  if (isForImage) {
    rolePrefix += " designer with 15+ years of experience in visual communication";
    taskType = "design";
  } else if (isForText) {
    rolePrefix += " writer with a background in professional content creation";
    taskType = "writing";
  } else if (isForCode) {
    rolePrefix += " developer with extensive knowledge of modern programming practices";
    taskType = "development";
  } else {
    rolePrefix += " professional with a diverse skillset";
    taskType = "task";
  }
  
  return `${rolePrefix}. I need your help with this ${taskType} request: ${input}

Please approach this task step by step:
1. Analyze the requirements thoroughly
2. Plan your approach based on best practices
3. Execute with attention to detail
4. Review and refine the result

For context: This is for professional use and quality is paramount. Please be thorough in your response and explain your reasoning where appropriate.`;
}

function generateProfessionalBusinessPrompt(input) {
  // Detect business domain for more specific terminology
  let domain = "business";
  let audience = "Business professionals and stakeholders";
  
  if (input.toLowerCase().includes('marketing')) {
    domain = "marketing";
    audience = "Marketing professionals and potential customers";
  } else if (input.toLowerCase().includes('finance') || input.toLowerCase().includes('financial')) {
    domain = "financial";
    audience = "Financial stakeholders and decision-makers";
  } else if (input.toLowerCase().includes('tech') || input.toLowerCase().includes('technology')) {
    domain = "technology";
    audience = "Technology professionals and business stakeholders";
  }
  
  return `BUSINESS REQUEST

OBJECTIVE: ${input}

REQUIREMENTS:
• Professional ${domain} standard quality
• Clear, concise, and actionable content
• Adherence to industry best practices
• Results-oriented approach

TARGET AUDIENCE: ${audience}

DELIVERABLE SPECIFICATIONS:
- Formal business tone and language
- Well-structured with logical flow
- Evidence-based recommendations where applicable
- Strategic alignment with business objectives

Please provide a comprehensive solution that addresses all requirements while maintaining the highest standards of business professionalism.`;
}

function generateCreativePrompt(input) {
  // Detect creative direction for specialized approach
  let creativeDirection = "Create something unique and memorable";
  let stylistic = "Use rich, evocative details";
  
  if (input.toLowerCase().includes('story') || input.toLowerCase().includes('narrative')) {
    creativeDirection = "Craft an engaging narrative with compelling characters";
    stylistic = "Create immersive world-building with sensory details";
  } else if (input.toLowerCase().includes('poem') || input.toLowerCase().includes('poetry')) {
    creativeDirection = "Compose evocative verses with meaningful imagery";
    stylistic = "Use rhythm, metaphor, and symbolic language";
  }
  
  return `CREATIVE BRIEF

CONCEPT: ${input}

CREATIVE DIRECTION:
• ${creativeDirection}
• Evoke emotion and engagement
• Balance innovation with accessibility
• Use vivid descriptive language/imagery

STYLISTIC ELEMENTS:
- Incorporate unexpected perspectives
- ${stylistic}
- Create a coherent mood and atmosphere
- Balance form and function

Take creative liberties while maintaining the core concept. The result should be both original and impactful, leaving a lasting impression on the audience.`;
}

// Function to simulate typing effect with variable speed
async function typeText(text, element, delay = 10) {
  isTyping = true;
  convertBtn.disabled = true;
  element.textContent = "";
  currentOutput = text;
  
  // Variable typing speed based on content
  for (let i = 0; i < text.length; i++) {
    // Slow down at punctuation for more natural effect
    const char = text.charAt(i);
    const nextChar = text.charAt(i + 1);
    let currentDelay = delay;
    
    if (['.', '!', '?', ':'].includes(char) && (nextChar === ' ' || nextChar === '\n')) {
      currentDelay = delay * 5; // Longer pause at end of sentences
    } else if ([',', ';'].includes(char)) {
      currentDelay = delay * 3; // Medium pause at commas
    }
    
    element.textContent += char;
    
    // Scroll to bottom as text is typed
    element.scrollTop = element.scrollHeight;
    
    // Random slight variation in typing speed
    const randomDelay = currentDelay + Math.random() * 10;
    await new Promise(resolve => setTimeout(resolve, randomDelay));
  }
  
  isTyping = false;
  convertBtn.disabled = false;
}

// Save prompt to history
function saveToHistory(input, output, style) {
  const history = JSON.parse(localStorage.getItem('promptHistory') || '[]');
  
  // Add to beginning of array (most recent first)
  history.unshift({
    input: input,
    output: output,
    style: style,
    timestamp: new Date().toISOString()
  });
  
  // Keep only the latest 20 items
  if (history.length > 20) {
    history.pop();
  }
  
  localStorage.setItem('promptHistory', JSON.stringify(history));
  renderHistory();
}

// Render history items
function renderHistory() {
  const history = JSON.parse(localStorage.getItem('promptHistory') || '[]');
  
  if (history.length > 0) {
    historySection.style.display = 'block';
    historyItems.innerHTML = '';
    
    history.forEach((item, index) => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      
      const date = new Date(item.timestamp);
      const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      
      historyItem.innerHTML = `
        <span class="history-item-text" title="${item.input}">${item.input.substring(0, 40)}${item.input.length > 40 ? '...' : ''}</span>
        <span class="history-item-tag">${item.style}</span>
      `;
      
      historyItem.addEventListener('click', () => {
        userInput.value = item.input;
        promptStyle.value = item.style;
        outputText.textContent = item.output;
        currentOutput = item.output;
        
        // If custom style, show the custom template field
        if (item.style === 'custom') {
          customTemplateContainer.style.display = 'block';
        } else {
          customTemplateContainer.style.display = 'none';
        }
      });
      
      historyItems.appendChild(historyItem);
    });
  } else {
    historySection.style.display = 'none';
  }
}

// Clear history
clearHistory.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear your prompt history?')) {
    localStorage.removeItem('promptHistory');
    renderHistory();
  }
});

// Event listener for convert button
convertBtn.addEventListener('click', async () => {
  if (isTyping) return;
  
  loadingIndicator.style.display = "flex";
  
  // Simulate AI processing time with variable delay based on input length
  const processingTime = Math.min(2000, 500 + userInput.value.length * 2);
  await new Promise(resolve => setTimeout(resolve, processingTime));
  
  const input = userInput.value;
  const style = promptStyle.value;
  const professionalPrompt = generateProfessionalPrompt(input, style);
  
  loadingIndicator.style.display = "none";
  
  // Type the result
  await typeText(professionalPrompt, outputText);
});

// Event listener for copy button
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(outputText.textContent).then(() => {
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  });
});

// Event listener for save button
saveBtn.addEventListener('click', () => {
  if (!userInput.value.trim() || !currentOutput.trim()) return;
  
  saveToHistory(userInput.value.trim(), currentOutput, promptStyle.value);
  
  const originalText = saveBtn.textContent;
  saveBtn.textContent = "Saved!";
  setTimeout(() => {
    saveBtn.textContent = originalText;
  }, 2000);
});

// Initialize with a placeholder
window.addEventListener('load', () => {
  userInput.focus();
  initTheme();
  renderHistory();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + Enter to convert
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    if (!convertBtn.disabled) {
      convertBtn.click();
    }
    e.preventDefault();
  }
  
  // Ctrl/Cmd + Shift + C to copy
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
    copyBtn.click();
    e.preventDefault();
  }
});