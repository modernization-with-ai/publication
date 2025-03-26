// Global variables to store loaded data
let processorData = null;
let workloadData = null;

// URLs for the JSON data files (update these with your GitHub URLs)
const PROCESSOR_DATA_URL = 'processor-data.json';
const WORKLOAD_DATA_URL = 'workload-data.json';

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load data from JSON files
        await loadData();
        
        // Initialize UI components
        initializeTabs();
        initializeProcessorSelectors();
        initializeWorkloadSelector();
        initializeMigrationCalculator();
        setupEventListeners();
        
        console.log('Processor Comparison Tool initialized successfully.');
    } catch (error) {
        console.error('Error initializing the application:', error);
        showError('Failed to initialize the application. Please try refreshing the page.');
    }
});

// Load data from JSON files
async function loadData() {
    try {
        // Load processor data
        const processorResponse = await fetch(PROCESSOR_DATA_URL);
        if (!processorResponse.ok) {
            throw new Error(`Failed to load processor data: ${processorResponse.status}`);
        }
        processorData = await processorResponse.json();
        
        // Load workload data
        const workloadResponse = await fetch(WORKLOAD_DATA_URL);
        if (!workloadResponse.ok) {
            throw new Error(`Failed to load workload data: ${workloadResponse.status}`);
        }
        workloadData = await workloadResponse.json();
        
        console.log('Data loaded successfully:', { processorData, workloadData });
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
}

// Initialize tab switching functionality
function initializeTabs() {
    // Processor comparison tabs
    const comparisonTabs = document.querySelectorAll('.tab');
    comparisonTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            comparisonTabs.forEach(t => {
                t.classList.remove('tab-active');
                t.classList.remove('power-border');
                t.classList.remove('intel-border');
                t.classList.remove('mainframe-border');
            });
            
            // Add active class to clicked tab
            this.classList.add('tab-active');
            
            // Add appropriate border color
            if (this.id === 'tab-power-intel' || this.id === 'tab-power-mainframe') {
                this.classList.add('power-border');
            } else if (this.id === 'tab-intel-mainframe') {
                this.classList.add('intel-border');
            } else {
                this.classList.add('power-border');
            }
            
            // Show/hide processor selectors based on selected tab
            updateProcessorSelectors(this.id);
        });
    });
    
    // Result tabs
    const resultTabs = document.querySelectorAll('.result-tab');
    resultTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            resultTabs.forEach(t => t.classList.remove('result-tab-active', 'border-blue-600'));
            
            // Add active class to clicked tab
            this.classList.add('result-tab-active', 'border-blue-600');
            
            // Hide all content
            document.querySelectorAll('.result-content').forEach(content => {
                content.classList.add('hidden');
            });
            
            // Show content for clicked tab
            const contentId = this.id.replace('result-tab-', 'result-');
            document.getElementById(contentId).classList.remove('hidden');
        });
    });
    
    // Architecture tabs
    const archTabs = document.querySelectorAll('.arch-tab');
    archTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            archTabs.forEach(t => t.classList.remove('arch-tab-active', 'border-blue-600'));
            
            // Add active class to clicked tab
            this.classList.add('arch-tab-active', 'border-blue-600');
            
            // Hide all content
            document.querySelectorAll('.arch-content').forEach(content => {
                content.classList.add('hidden');
            });
            
            // Show content for clicked tab
            const contentId = this.id.replace('arch-tab-', 'arch-');
            document.getElementById(contentId).classList.remove('hidden');
        });
    });
}

// Update processor selectors based on selected tab
function updateProcessorSelectors(tabId) {
    const powerSelector = document.getElementById('power-selector-container');
    const intelSelector = document.getElementById('intel-selector-container');
    const mainframeSelector = document.getElementById('mainframe-selector-container');
    
    // Reset selections
    document.getElementById('power-processor').value = '';
    document.getElementById('intel-processor').value = '';
    document.getElementById('mainframe-processor').value = '';
    
    // Show/hide selectors based on tab
    switch (tabId) {
        case 'tab-power-intel':
            powerSelector.classList.remove('hidden');
            intelSelector.classList.remove('hidden');
            mainframeSelector.classList.add('hidden');
            break;
        case 'tab-power-mainframe':
            powerSelector.classList.remove('hidden');
            intelSelector.classList.add('hidden');
            mainframeSelector.classList.remove('hidden');
            break;
        case 'tab-intel-mainframe':
            powerSelector.classList.add('hidden');
            intelSelector.classList.remove('hidden');
            mainframeSelector.classList.remove('hidden');
            break;
        case 'tab-all':
            powerSelector.classList.remove('hidden');
            intelSelector.classList.remove('hidden');
            mainframeSelector.classList.remove('hidden');
            break;
    }
}

// Initialize processor selectors with data from JSON
function initializeProcessorSelectors() {
    if (!processorData) {
        console.error('Processor data not loaded');
        return;
    }
    
    // Power processor selector
    const powerSelect = document.getElementById('power-processor');
    powerSelect.innerHTML = '<option value="">Select POWER Processor</option>';
    
    // Add POWER8 processors
    if (processorData.powerProcessors.power8.length > 0) {
        const power8Group = document.createElement('optgroup');
        power8Group.label = 'POWER8';
        processorData.powerProcessors.power8.forEach(processor => {
            const option = document.createElement('option');
            option.value = processor.id;
            option.textContent = processor.name;
            power8Group.appendChild(option);
        });
        powerSelect.appendChild(power8Group);
    }
    
    // Add POWER9 processors
    if (processorData.powerProcessors.power9.length > 0) {
        const power9Group = document.createElement('optgroup');
        power9Group.label = 'POWER9';
        processorData.powerProcessors.power9.forEach(processor => {
            const option = document.createElement('option');
            option.value = processor.id;
            option.textContent = processor.name;
            power9Group.appendChild(option);
        });
        powerSelect.appendChild(power9Group);
    }
    
    // Add POWER10 processors
    if (processorData.powerProcessors.power10.length > 0) {
        const power10Group = document.createElement('optgroup');
        power10Group.label = 'POWER10';
        processorData.powerProcessors.power10.forEach(processor => {
            const option = document.createElement('option');
            option.value = processor.id;
            option.textContent = processor.name;
            power10Group.appendChild(option);
        });
        powerSelect.appendChild(power10Group);
    }
    
    // Intel processor selector
    const intelSelect = document.getElementById('intel-processor');
    intelSelect.innerHTML = '<option value="">Select Intel Processor</option>';
    
    // Add Haswell processors
    if (processorData.intelProcessors.haswell.length > 0) {
        const haswellGroup = document.createElement('optgroup');
        haswellGroup.label = 'Haswell';
        processorData.intelProcessors.haswell.forEach(processor => {
            const option = document.createElement('option');
            option.value = processor.id;
            option.textContent = processor.name;
            haswellGroup.appendChild(option);
        });
        intelSelect.appendChild(haswellGroup);
    }
    
    // Add Skylake processors
    if (processorData.intelProcessors.skylake.length > 0) {
        const skylakeGroup = document.createElement('optgroup');
        skylakeGroup.label = 'Skylake';
        processorData.intelProcessors.skylake.forEach(processor => {
            const option = document.createElement('option');
            option.value = processor.id;
            option.textContent = processor.name;
            skylakeGroup.appendChild(option);
        });
        intelSelect.appendChild(skylakeGroup);
    }
    
    // Add Ice Lake processors
    if (processorData.intelProcessors.icelake.length > 0) {
        const icelakeGroup = document.createElement('optgroup');
        icelakeGroup.label = 'Ice Lake';
        processorData.intelProcessors.icelake.forEach(processor => {
            const option = document.createElement('option');
            option.value = processor.id;
            option.textContent = processor.name;
            icelakeGroup.appendChild(option);
        });
        intelSelect.appendChild(icelakeGroup);
    }
    
    // Mainframe processor selector
    const mainframeSelect = document.getElementById('mainframe-processor');
    mainframeSelect.innerHTML = '<option value="">Select Mainframe Processor</option>';
    
    // Add z10 EC processors
    if (processorData.mainframeProcessors.z10EC.length > 0) {
        const z10ECGroup = document.createElement('optgroup');
        z10ECGroup.label = 'z10 EC';
        processorData.mainframeProcessors.z10EC.forEach(processor => {
            const option = document.createElement('option');
            option.value = processor.id;
            option.textContent = processor.name;
            z10ECGroup.appendChild(option);
        });
        mainframeSelect.appendChild(z10ECGroup);
    }
    
    // Add z10 BC processors
    if (processorData.mainframeProcessors.z10BC.length > 0) {
        const z10BCGroup = document.createElement('optgroup');
        z10BCGroup.label = 'z10 BC';
        processorData.mainframeProcessors.z10BC.forEach(processor => {
            const option = document.createElement('option');
            option.value = processor.id;
            option.textContent = processor.name;
            z10BCGroup.appendChild(option);
        });
        mainframeSelect.appendChild(z10BCGroup);
    }
}

// Initialize workload selector with data from JSON
function initializeWorkloadSelector() {
    if (!workloadData) {
        console.error('Workload data not loaded');
        return;
    }
    
    const workloadSelect = document.getElementById('workload-type');
    workloadSelect.innerHTML = '<option value="">Select Workload Type</option>';
    
    workloadData.workloadTypes.forEach(workload => {
        const option = document.createElement('option');
        option.value = workload.id;
        option.textContent = `${workload.name} (${workload.tpmPerMips} tpm/MIPS)`;
        workloadSelect.appendChild(option);
    });
    
    // Add event listener to show workload info
    workloadSelect.addEventListener('change', function() {
        const workloadId = this.value;
        const workloadInfo = document.getElementById('workload-info');
        
        if (workloadId) {
            const workload = workloadData.workloadTypes.find(w => w.id === workloadId);
            if (workload) {
                let examplesHtml = '';
                if (workload.examples && workload.examples.length > 0) {
                    examplesHtml = `
                        <h4 class="font-semibold mt-2 mb-1">Examples:</h4>
                        <ul class="list-disc list-inside">
                            ${workload.examples.map(example => `<li>${example}</li>`).join('')}
                        </ul>
                    `;
                }
                
                let characteristicsHtml = '';
                if (workload.characteristics && workload.characteristics.length > 0) {
                    characteristicsHtml = `
                        <h4 class="font-semibold mt-2 mb-1">Key Characteristics:</h4>
                        <ul class="list-disc list-inside">
                            ${workload.characteristics.map(char => `<li>${char}</li>`).join('')}
                        </ul>
                    `;
                }
                
                workloadInfo.innerHTML = `
                    <h3 class="font-semibold text-lg mb-2">${workload.name}</h3>
                    <p>${workload.description}</p>
                    <p class="mt-1"><span class="font-semibold">Workload Factor:</span> ${workload.tpmPerMips} tpm/MIPS</p>
                    ${examplesHtml}
                    ${characteristicsHtml}
                `;
                workloadInfo.classList.remove('hidden');
            }
        } else {
            workloadInfo.classList.add('hidden');
        }
    });
    
    // Initialize migration workload selector
    const migrationWorkloadSelect = document.getElementById('migration-workload-type');
    migrationWorkloadSelect.innerHTML = '<option value="">Select Workload Type</option>';
    
    workloadData.workloadTypes.forEach(workload => {
        const option = document.createElement('option');
        option.value = workload.id;
        option.textContent = `${workload.name} (${workload.tpmPerMips} tpm/MIPS)`;
        migrationWorkloadSelect.appendChild(option);
    });
    
    // Add custom option
    const customOption = document.createElement('option');
    customOption.value = 'custom';
    customOption.textContent = 'Custom Mix';
    migrationWorkloadSelect.appendChild(customOption);
}

// Initialize migration calculator functionality
function initializeMigrationCalculator() {
    // Show/hide custom workload mix inputs
    document.getElementById('migration-workload-type').addEventListener('change', function() {
        if (this.value === 'custom') {
            document.getElementById('custom-workload-mix').classList.remove('hidden');
        } else {
            document.getElementById('custom-workload-mix').classList.add('hidden');
        }
    });
    
    // Update custom workload mix total
    const customInputs = [
        'custom-processor-intensive',
        'custom-tpc-c',
        'custom-commercial',
        'custom-mixed',
        'custom-bi'
    ];
    
    customInputs.forEach(inputId => {
        document.getElementById(inputId).addEventListener('input', updateCustomTotal);
    });
    
    // Calculate migration sizing
    document.getElementById('calculate-migration').addEventListener('click', calculateMigrationSizing);
}

// Update custom workload mix total
function updateCustomTotal() {
    const customInputs = [
        'custom-processor-intensive',
        'custom-tpc-c',
        'custom-commercial',
        'custom-mixed',
        'custom-bi'
    ];
    
    let total = 0;
    customInputs.forEach(inputId => {
        const value = parseInt(document.getElementById(inputId).value) || 0;
        total += value;
    });
    
    document.getElementById('custom-total').textContent = `Total: ${total}%`;
    
    if (total === 100) {
        document.getElementById('custom-total').classList.add('text-green-600');
        document.getElementById('custom-total').classList.remove('text-red-600');
    } else {
        document.getElementById('custom-total').classList.add('text-red-600');
        document.getElementById('custom-total').classList.remove('text-green-600');
    }
}

// Set up event listeners for buttons
function setupEventListeners() {
    // Compare processors button
    document.getElementById('compare-processors').addEventListener('click', compareProcessors);
}

// Get workload factor based on selected workload type
function getWorkloadFactor(workloadType) {
    if (!workloadType) return null;
    
    const workload = workloadData.workloadTypes.find(w => w.id === workloadType);
    return workload ? workload.tpmPerMips : null;
}

// Get processor object based on ID and type
function getProcessor(id, type) {
    if (!id) return null;
    
    if (type === 'power') {
        // Search in power8, power9, and power10 arrays
        const power8Processor = processorData.powerProcessors.power8.find(p => p.id === id);
        if (power8Processor) return power8Processor;
        
        const power9Processor = processorData.powerProcessors.power9.find(p => p.id === id);
        if (power9Processor) return power9Processor;
        
        const power10Processor = processorData.powerProcessors.power10.find(p => p.id === id);
        if (power10Processor) return power10Processor;
    } else if (type === 'intel') {
        // Search in haswell, skylake, and icelake arrays
        const haswellProcessor = processorData.intelProcessors.haswell.find(p => p.id === id);
        if (haswellProcessor) return haswellProcessor;
        
        const skylakeProcessor = processorData.intelProcessors.skylake.find(p => p.id === id);
        if (skylakeProcessor) return skylakeProcessor;
        
        const icelakeProcessor = processorData.intelProcessors.icelake.find(p => p.id === id);
        if (icelakeProcessor) return icelakeProcessor;
    } else if (type === 'mainframe') {
        // Search in z10EC and z10BC arrays
        const z10ECProcessor = processorData.mainframeProcessors.z10EC.find(p => p.id === id);
        if (z10ECProcessor) return z10ECProcessor;
        
        const z10BCProcessor = processorData.mainframeProcessors.z10BC.find(p => p.id === id);
        if (z10BCProcessor) return z10BCProcessor;
    }
    
    return null;
}

// Compare processors
function compareProcessors() {
    // Get selected tab
    const activeTab = document.querySelector('.tab.tab-active');
    if (!activeTab) {
        showError('Please select a comparison tab.');
        return;
    }
    
    // Get selected processors
    const powerProcessorId = document.getElementById('power-processor').value;
    const intelProcessorId = document.getElementById('intel-processor').value;
    const mainframeProcessorId = document.getElementById('mainframe-processor').value;
    
    // Get selected workload type
    const workloadType = document.getElementById('workload-type').value;
    if (!workloadType) {
        showError('Please select a workload type.');
        return;
    }
    
    // Validate selections based on active tab
    let processor1, processor2, processor1Type, processor2Type;
    
    switch (activeTab.id) {
        case 'tab-power-intel':
            if (!powerProcessorId) {
                showError('Please select a POWER processor.');
                return;
            }
            if (!intelProcessorId) {
                showError('Please select an Intel processor.');
                return;
            }
            processor1 = getProcessor(powerProcessorId, 'power');
            processor2 = getProcessor(intelProcessorId, 'intel');
            processor1Type = 'power';
            processor2Type = 'intel';
            break;
        case 'tab-power-mainframe':
            if (!powerProcessorId) {
                showError('Please select a POWER processor.');
                return;
            }
            if (!mainframeProcessorId) {
                showError('Please select a Mainframe processor.');
                return;
            }
            processor1 = getProcessor(powerProcessorId, 'power');
            processor2 = getProcessor(mainframeProcessorId, 'mainframe');
            processor1Type = 'power';
            processor2Type = 'mainframe';
            break;
        case 'tab-intel-mainframe':
            if (!intelProcessorId) {
                showError('Please select an Intel processor.');
                return;
            }
            if (!mainframeProcessorId) {
                showError('Please select a Mainframe processor.');
                return;
            }
            processor1 = getProcessor(intelProcessorId, 'intel');
            processor2 = getProcessor(mainframeProcessorId, 'mainframe');
            processor1Type = 'intel';
            processor2Type = 'mainframe';
            break;
        case 'tab-all':
            if (!powerProcessorId && !intelProcessorId && !mainframeProcessorId) {
                showError('Please select at least two processors to compare.');
                return;
            }
            
            // For "All" tab, determine which processors to compare based on selections
            if (powerProcessorId && intelProcessorId) {
                processor1 = getProcessor(powerProcessorId, 'power');
                processor2 = getProcessor(intelProcessorId, 'intel');
                processor1Type = 'power';
                processor2Type = 'intel';
            } else if (powerProcessorId && mainframeProcessorId) {
                processor1 = getProcessor(powerProcessorId, 'power');
                processor2 = getProcessor(mainframeProcessorId, 'mainframe');
                processor1Type = 'power';
                processor2Type = 'mainframe';
            } else if (intelProcessorId && mainframeProcessorId) {
                processor1 = getProcessor(intelProcessorId, 'intel');
                processor2 = getProcessor(mainframeProcessorId, 'mainframe');
                processor1Type = 'intel';
                processor2Type = 'mainframe';
            } else {
                showError('Please select at least two processors to compare.');
                return;
            }
            break;
    }
    
    // Validate processors
    if (!processor1 || !processor2) {
        showError('Failed to retrieve processor information. Please try again.');
        return;
    }
    
    // Get workload factor
    const workloadFactor = getWorkloadFactor(workloadType);
    if (!workloadFactor) {
        showError('Invalid workload type.');
        return;
    }
    
    // Update comparison results UI
    updateComparisonResults(processor1, processor2, processor1Type, processor2Type, workloadType, workloadFactor);
    
    // Show comparison results
    document.getElementById('comparison-results').classList.remove('hidden');
    
    // Scroll to results
    document.getElementById('comparison-results').scrollIntoView({ behavior: 'smooth' });
}

// Update comparison results UI
function updateComparisonResults(processor1, processor2, processor1Type, processor2Type, workloadType, workloadFactor) {
    // Update summary
    updateSummary(processor1, processor2, processor1Type, processor2Type, workloadType);
    
    // Update details table
    updateDetailsTable(processor1, processor2, processor1Type, processor2Type);
    
    // Update charts
    updateCharts(processor1, processor2, processor1Type, processor2Type, workloadType);
}

// Update comparison summary
function updateSummary(processor1, processor2, processor1Type, processor2Type) {
    const summaryText = document.getElementById('summary-text');
    
    let processor1Performance, processor2Performance;
    
    // For mainframe processors, use MIPS rating
    if (processor1Type === 'mainframe') {
        processor1Performance = processor1.mips;
    } else {
        processor1Performance = processor1.multiThreadScore;
    }
    
    if (processor2Type === 'mainframe') {
        processor2Performance = processor2.mips;
    } else {
        processor2Performance = processor2.multiThreadScore;
    }
    
    // Special handling for mainframe comparison
    let comparisonText;
    
    if (processor1Type === 'mainframe' || processor2Type === 'mainframe') {
        if (processor1Type === 'mainframe') {
            // Mainframe vs non-mainframe
            comparisonText = `The ${processor1.name} (${processor1.mips} MIPS) is being compared to ${processor2.name} with a multi-thread performance score of ${processor2.multiThreadScore}.`;
        } else {
            // Non-mainframe vs mainframe
            comparisonText = `The ${processor1.name} with a multi-thread performance score of ${processor1.multiThreadScore} is being compared to ${processor2.name} (${processor2.mips} MIPS).`;
        }
    } else {
        // Non-mainframe comparison
        const ratio = (processor1Performance / processor2Performance).toFixed(2);
        
        if (ratio > 1.2) {
            comparisonText = `<strong>The ${processor1.name}</strong> is approximately <strong>${ratio}x more powerful</strong> than the ${processor2.name} in multi-threaded workloads.`;
        } else if (ratio < 0.8) {
            const inverseRatio = (processor2Performance / processor1Performance).toFixed(2);
            comparisonText = `<strong>The ${processor2.name}</strong> is approximately <strong>${inverseRatio}x more powerful</strong> than the ${processor1.name} in multi-threaded workloads.`;
        } else {
            comparisonText = `<strong>The ${processor1.name}</strong> and <strong>${processor2.name}</strong> offer comparable performance in multi-threaded workloads (ratio: ${ratio}).`;
        }
    }
    
    // Add core and thread information
    let coreThreadText;
    
    if (processor1Type === 'mainframe') {
        if (processor2Type === 'mainframe') {
            coreThreadText = `The ${processor1.name} has ${processor1.cores} cores, while the ${processor2.name} has ${processor2.cores} cores.`;
        } else {
            coreThreadText = `The ${processor1.name} has ${processor1.cores} cores, while the ${processor2.name} has ${processor2.cores} cores and ${processor2.threads} threads.`;
        }
    } else if (processor2Type === 'mainframe') {
        coreThreadText = `The ${processor1.name} has ${processor1.cores} cores and ${processor1.threads} threads, while the ${processor2.name} has ${processor2.cores} cores.`;
    } else {
        coreThreadText = `The ${processor1.name} features ${processor1.cores} cores and ${processor1.threads} threads, while the ${processor2.name} has ${processor2.cores} cores and ${processor2.threads} threads.`;
    }
    
    summaryText.innerHTML = `${comparisonText} ${coreThreadText}`;
    
    // Update score cards
    const scoreContainer = document.querySelector('.score-container');
    
    let scoreCardsHtml = '';
    
    if (processor1Type !== 'mainframe') {
        // Single-Thread Score for processor1
        scoreCardsHtml += `
            <div class="border rounded-lg p-4 bg-white">
                <div class="processor-icon ${processor1Type}-bg text-white flex items-center justify-center text-xl font-bold h-12 w-12 rounded-full mx-auto">${processor1Type === 'power' ? 'P' : 'I'}</div>
                <div class="text-2xl font-bold text-center ${processor1Type}-text mt-2">${processor1.singleThreadScore}</div>
                <div class="text-sm text-gray-600 text-center">Single-Thread Score</div>
                <div class="text-center mt-2 text-sm">${processor1.name}</div>
            </div>
        `;
    } else {
        // MIPS per core for processor1
        scoreCardsHtml += `
            <div class="border rounded-lg p-4 bg-white">
                <div class="processor-icon ${processor1Type}-bg text-white flex items-center justify-center text-xl font-bold h-12 w-12 rounded-full mx-auto">M</div>
                <div class="text-2xl font-bold text-center ${processor1Type}-text mt-2">${processor1.mipsPerCore}</div>
                <div class="text-sm text-gray-600 text-center">MIPS per Core</div>
                <div class="text-center mt-2 text-sm">${processor1.name}</div>
            </div>
        `;
    }
    
    if (processor2Type !== 'mainframe') {
        // Single-Thread Score for processor2
        scoreCardsHtml += `
            <div class="border rounded-lg p-4 bg-white">
                <div class="processor-icon ${processor2Type}-bg text-white flex items-center justify-center text-xl font-bold h-12 w-12 rounded-full mx-auto">${processor2Type === 'power' ? 'P' : 'I'}</div>
                <div class="text-2xl font-bold text-center ${processor2Type}-text mt-2">${processor2.singleThreadScore}</div>
                <div class="text-sm text-gray-600 text-center">Single-Thread Score</div>
                <div class="text-center mt-2 text-sm">${processor2.name}</div>
            </div>
        `;
    } else {
        // MIPS per core for processor2
        scoreCardsHtml += `
            <div class="border rounded-lg p-4 bg-white">
                <div class="processor-icon ${processor2Type}-bg text-white flex items-center justify-center text-xl font-bold h-12 w-12 rounded-full mx-auto">M</div>
                <div class="text-2xl font-bold text-center ${processor2Type}-text mt-2">${processor2.mipsPerCore}</div>
                <div class="text-sm text-gray-600 text-center">MIPS per Core</div>
                <div class="text-center mt-2 text-sm">${processor2.name}</div>
            </div>
        `;
    }
    
    if (processor1Type !== 'mainframe') {
        // Multi-Thread Score for processor1
        scoreCardsHtml += `
            <div class="border rounded-lg p-4 bg-white">
                <div class="processor-icon ${processor1Type}-bg text-white flex items-center justify-center text-xl font-bold h-12 w-12 rounded-full mx-auto">${processor1Type === 'power' ? 'P' : 'I'}</div>
                <div class="text-2xl font-bold text-center ${processor1Type}-text mt-2">${processor1.multiThreadScore}</div>
                <div class="text-sm text-gray-600 text-center">Multi-Thread Score</div>
                <div class="text-center mt-2 text-sm">${processor1.name}</div>
            </div>
        `;
    } else {
        // Total MIPS for processor1
        scoreCardsHtml += `
            <div class="border rounded-lg p-4 bg-white">
                <div class="processor-icon ${processor1Type}-bg text-white flex items-center justify-center text-xl font-bold h-12 w-12 rounded-full mx-auto">M</div>
                <div class="text-2xl font-bold text-center ${processor1Type}-text mt-2">${processor1.mips}</div>
                <div class="text-sm text-gray-600 text-center">Total MIPS</div>
                <div class="text-center mt-2 text-sm">${processor1.name}</div>
            </div>
        `;
    }
    
    if (processor2Type !== 'mainframe') {
        // Multi-Thread Score for processor2
        scoreCardsHtml += `
            <div class="border rounded-lg p-4 bg-white">
                <div class="processor-icon ${processor2Type}-bg text-white flex items-center justify-center text-xl font-bold h-12 w-12 rounded-full mx-auto">${processor2Type === 'power' ? 'P' : 'I'}</div>
                <div class="text-2xl font-bold text-center ${processor2Type}-text mt-2">${processor2.multiThreadScore}</div>
                <div class="text-sm text-gray-600 text-center">Multi-Thread Score</div>
                <div class="text-center mt-2 text-sm">${processor2.name}</div>
            </div>
        `;
    } else {
        // Total MIPS for processor2
        scoreCardsHtml += `
            <div class="border rounded-lg p-4 bg-white">
                <div class="processor-icon ${processor2Type}-bg text-white flex items-center justify-center text-xl font-bold h-12 w-12 rounded-full mx-auto">M</div>
                <div class="text-2xl font-bold text-center ${processor2Type}-text mt-2">${processor2.mips}</div>
                <div class="text-sm text-gray-600 text-center">Total MIPS</div>
                <div class="text-center mt-2 text-sm">${processor2.name}</div>
            </div>
        `;
    }
    
    scoreContainer.innerHTML = scoreCardsHtml;
    
    // Update comparison metrics bars
    updateComparisonMetrics(processor1, processor2, processor1Type, processor2Type);
}

// Update comparison metrics with bars
function updateComparisonMetrics(processor1, processor2, processor1Type, processor2Type) {
    const metricsDiv = document.getElementById('comparison-metrics');
    
    if (processor1Type === 'mainframe' || processor2Type === 'mainframe') {
        // For mainframe comparisons, show limited metrics
        metricsDiv.innerHTML = `
            <h3 class="text-lg font-semibold mb-3">Key Metrics Comparison</h3>
            
            <div class="border rounded-lg p-4 bg-white mb-4">
                <div class="mb-2 font-semibold">Cores</div>
                <div class="flex items-center mb-4">
                    <div class="w-1/4 text-sm">${processor1.name}</div>
                    <div class="w-1/2 h-6 bg-gray-200 rounded">
                        <div class="bar-${processor1Type} h-full rounded" style="width: ${Math.min(processor1.cores / 64 * 100, 100)}%">${processor1.cores}</div>
                    </div>
                </div>
                <div class="flex items-center">
                    <div class="w-1/4 text-sm">${processor2.name}</div>
                    <div class="w-1/2 h-6 bg-gray-200 rounded">
                        <div class="bar-${processor2Type} h-full rounded" style="width: ${Math.min(processor2.cores / 64 * 100, 100)}%">${processor2.cores}</div>
                    </div>
                </div>
            </div>
            
            ${processor1Type === 'mainframe' && processor2Type === 'mainframe' ? `
                <div class="border rounded-lg p-4 bg-white">
                    <div class="mb-2 font-semibold">Total MIPS</div>
                    <div class="flex items-center mb-4">
                        <div class="w-1/4 text-sm">${processor1.name}</div>
                        <div class="w-1/2 h-6 bg-gray-200 rounded">
                            <div class="bar-${processor1Type} h-full rounded" style="width: ${Math.min(processor1.mips / 10000 * 100, 100)}%">${processor1.mips}</div>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <div class="w-1/4 text-sm">${processor2.name}</div>
                        <div class="w-1/2 h-6 bg-gray-200 rounded">
                            <div class="bar-${processor2Type} h-full rounded" style="width: ${Math.min(processor2.mips / 10000 * 100, 100)}%">${processor2.mips}</div>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;
    } else {
        // For non-mainframe comparisons, show full metrics
        const maxSingleThread = Math.max(processor1.singleThreadScore, processor2.singleThreadScore);
        const maxMultiThread = Math.max(processor1.multiThreadScore, processor2.multiThreadScore);
        
        metricsDiv.innerHTML = `
            <h3 class="text-lg font-semibold mb-3">Performance Metrics Comparison</h3>
            
            <div class="border rounded-lg p-4 bg-white mb-4">
                <div class="mb-2 font-semibold">Single-Thread Performance</div>
                <div class="flex items-center mb-4">
                    <div class="w-1/4 text-sm">${processor1.name}</div>
                    <div class="w-1/2 h-6 bg-gray-200 rounded">
                        <div class="bar-${processor1Type} h-full rounded" style="width: ${processor1.singleThreadScore / maxSingleThread * 100}%">${processor1.singleThreadScore}</div>
                    </div>
                </div>
                <div class="flex items-center">
                    <div class="w-1/4 text-sm">${processor2.name}</div>
                    <div class="w-1/2 h-6 bg-gray-200 rounded">
                        <div class="bar-${processor2Type} h-full rounded" style="width: ${processor2.singleThreadScore / maxSingleThread * 100}%">${processor2.singleThreadScore}</div>
                    </div>
                </div>
            </div>
            
            <div class="border rounded-lg p-4 bg-white mb-4">
                <div class="mb-2 font-semibold">Multi-Thread Performance</div>
                <div class="flex items-center mb-4">
                    <div class="w-1/4 text-sm">${processor1.name}</div>
                    <div class="w-1/2 h-6 bg-gray-200 rounded">
                        <div class="bar-${processor1Type} h-full rounded" style="width: ${processor1.multiThreadScore / maxMultiThread * 100}%">${processor1.multiThreadScore}</div>
                    </div>
                </div>
                <div class="flex items-center">
                    <div class="w-1/4 text-sm">${processor2.name}</div>
                    <div class="w-1/2 h-6 bg-gray-200 rounded">
                        <div class="bar-${processor2Type} h-full rounded" style="width: ${processor2.multiThreadScore / maxMultiThread * 100}%">${processor2.multiThreadScore}</div>
                    </div>
                </div>
            </div>
            
            <div class="border rounded-lg p-4 bg-white mb-4">
                <div class="mb-2 font-semibold">Cores</div>
                <div class="flex items-center mb-4">
                    <div class="w-1/4 text-sm">${processor1.name}</div>
                    <div class="w-1/2 h-6 bg-gray-200 rounded">
                        <div class="bar-${processor1Type} h-full rounded" style="width: ${Math.min(processor1.cores / 64 * 100, 100)}%">${processor1.cores}</div>
                    </div>
                </div>
                <div class="flex items-center">
                    <div class="w-1/4 text-sm">${processor2.name}</div>
                    <div class="w-1/2 h-6 bg-gray-200 rounded">
                        <div class="bar-${processor2Type} h-full rounded" style="width: ${Math.min(processor2.cores / 64 * 100, 100)}%">${processor2.cores}</div>
                    </div>
                </div>
            </div>
            
            <div class="border rounded-lg p-4 bg-white">
                <div class="mb-2 font-semibold">Threads</div>
                <div class="flex items-center mb-4">
                    <div class="w-1/4 text-sm">${processor1.name}</div>
                    <div class="w-1/2 h-6 bg-gray-200 rounded">
                        <div class="bar-${processor1Type} h-full rounded" style="width: ${Math.min(processor1.threads / 128 * 100, 100)}%">${processor1.threads}</div>
                    </div>
                </div>
                <div class="flex items-center">
                    <div class="w-1/4 text-sm">${processor2.name}</div>
                    <div class="w-1/2 h-6 bg-gray-200 rounded">
                        <div class="bar-${processor2Type} h-full rounded" style="width: ${Math.min(processor2.threads / 128 * 100, 100)}%">${processor2.threads}</div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Update details table
function updateDetailsTable(processor1, processor2, processor1Type, processor2Type) {
    // Set header names
    document.getElementById('details-col1-header').textContent = processor1.name;
    document.getElementById('details-col2-header').textContent = processor2.name;
    
    // Set table body content
    const tableBody = document.getElementById('comparison-table-body');
    
    // Determine which properties to display based on processor types
    let rows = '';
    
    // Basic information for all processor types
    rows += `
        <tr>
            <td>Architecture</td>
            <td>${processor1Type === 'mainframe' ? 'IBM Mainframe' : processor1.architecture}</td>
            <td>${processor2Type === 'mainframe' ? 'IBM Mainframe' : processor2.architecture}</td>
        </tr>
        <tr>
            <td>Release Year</td>
            <td>${processor1.year}</td>
            <td>${processor2.year}</td>
        </tr>
        <tr>
            <td>Cores</td>
            <td>${processor1.cores}</td>
            <td>${processor2.cores}</td>
        </tr>
    `;
    
    // Add threads row if at least one processor is not a mainframe
    if (processor1Type !== 'mainframe' || processor2Type !== 'mainframe') {
        rows += `
            <tr>
                <td>Threads</td>
                <td>${processor1Type !== 'mainframe' ? processor1.threads : 'N/A'}</td>
                <td>${processor2Type !== 'mainframe' ? processor2.threads : 'N/A'}</td>
            </tr>
        `;
    }
    
    // Add frequency row
    rows += `
        <tr>
            <td>Base Frequency</td>
            <td>${processor1Type !== 'mainframe' ? processor1.frequency + ' GHz' : 'N/A'}</td>
            <td>${processor2Type !== 'mainframe' ? processor2.frequency + ' GHz' : 'N/A'}</td>
        </tr>
    `;
    
    // Add TDP row if at least one processor is not a mainframe
    if (processor1Type !== 'mainframe' || processor2Type !== 'mainframe') {
        rows += `
            <tr>
                <td>TDP</td>
                <td>${processor1Type !== 'mainframe' ? processor1.tdp + ' W' : 'N/A'}</td>
                <td>${processor2Type !== 'mainframe' ? processor2.tdp + ' W' : 'N/A'}</td>
            </tr>
        `;
    }
    
    // Add cache information for non-mainframe processors
    if (processor1Type !== 'mainframe' || processor2Type !== 'mainframe') {
        rows += `
            <tr>
                <td>L1 Cache</td>
                <td>${processor1Type !== 'mainframe' ? processor1.l1Cache : 'N/A'}</td>
                <td>${processor2Type !== 'mainframe' ? processor2.l1Cache : 'N/A'}</td>
            </tr>
            <tr>
                <td>L2 Cache</td>
                <td>${processor1Type !== 'mainframe' ? processor1.l2Cache : 'N/A'}</td>
                <td>${processor2Type !== 'mainframe' ? processor2.l2Cache : 'N/A'}</td>
            </tr>
            <tr>
                <td>L3 Cache</td>
                <td>${processor1Type !== 'mainframe' ? processor1.l3Cache : 'N/A'}</td>
                <td>${processor2Type !== 'mainframe' ? processor2.l3Cache : 'N/A'}</td>
            </tr>
        `;
    }
    
    // Add MIPS information for mainframe processors
    if (processor1Type === 'mainframe' || processor2Type === 'mainframe') {
        rows += `
            <tr>
                <td>MIPS Rating</td>
                <td>${processor1Type === 'mainframe' ? processor1.mips : 'N/A'}</td>
                <td>${processor2Type === 'mainframe' ? processor2.mips : 'N/A'}</td>
            </tr>
            <tr>
                <td>MIPS per Core</td>
                <td>${processor1Type === 'mainframe' ? processor1.mipsPerCore : 'N/A'}</td>
                <td>${processor2Type === 'mainframe' ? processor2.mipsPerCore : 'N/A'}</td>
            </tr>
        `;
    }
    
    // Add performance scores for non-mainframe processors
    if (processor1Type !== 'mainframe' || processor2Type !== 'mainframe') {
        rows += `
            <tr>
                <td>Single-Thread Score</td>
                <td>${processor1Type !== 'mainframe' ? processor1.singleThreadScore : 'N/A'}</td>
                <td>${processor2Type !== 'mainframe' ? processor2.singleThreadScore : 'N/A'}</td>
            </tr>
            <tr>
                <td>Multi-Thread Score</td>
                <td>${processor1Type !== 'mainframe' ? processor1.multiThreadScore : 'N/A'}</td>
                <td>${processor2Type !== 'mainframe' ? processor2.multiThreadScore : 'N/A'}</td>
            </tr>
        `;
    }
    
    // Add memory bandwidth
    if (processor1Type !== 'mainframe' || processor2Type !== 'mainframe') {
        rows += `
            <tr>
                <td>Memory Bandwidth</td>
                <td>${processor1Type !== 'mainframe' ? processor1.memoryBandwidth : 'N/A'}</td>
                <td>${processor2Type !== 'mainframe' ? processor2.memoryBandwidth : 'N/A'}</td>
            </tr>
        `;
    }
    
    // Add typical use case
    rows += `
        <tr>
            <td>Typical Use Case</td>
            <td>${processor1Type !== 'mainframe' ? processor1.useCase : 'Enterprise workloads, transaction processing'}</td>
            <td>${processor2Type !== 'mainframe' ? processor2.useCase : 'Enterprise workloads, transaction processing'}</td>
        </tr>
    `;
    
    // Add equivalent processor information if available
    if (processor1Type !== 'mainframe' && processor1.powerEquivalent) {
        rows += `
            <tr>
                <td>Power Equivalent</td>
                <td>${processor1.powerEquivalent}</td>
                <td>N/A</td>
            </tr>
        `;
    } else if (processor1Type !== 'mainframe' && processor1.intelEquivalent) {
        rows += `
            <tr>
                <td>Intel Equivalent</td>
                <td>${processor1.intelEquivalent}</td>
                <td>N/A</td>
            </tr>
        `;
    }
    
    if (processor2Type !== 'mainframe' && processor2.powerEquivalent) {
        rows += `
            <tr>
                <td>Power Equivalent</td>
                <td>N/A</td>
                <td>${processor2.powerEquivalent}</td>
            </tr>
        `;
    } else if (processor2Type !== 'mainframe' && processor2.intelEquivalent) {
        rows += `
            <tr>
                <td>Intel Equivalent</td>
                <td>N/A</td>
                <td>${processor2.intelEquivalent}</td>
            </tr>
        `;
    }
    
    // For mainframe processors, add HP equivalent information if available
    if (processor1Type === 'mainframe') {
        rows += `
            <tr>
                <td>HP Equivalent (Processor Intensive)</td>
                <td>${processor1.processorIntensiveEquivalent}</td>
                <td>N/A</td>
            </tr>
            <tr>
                <td>HP Equivalent (Commercial)</td>
                <td>${processor1.commercialEquivalent}</td>
                <td>N/A</td>
            </tr>
            <tr>
                <td>HP Equivalent (Business Intelligence)</td>
                <td>${processor1.biEquivalent}</td>
                <td>N/A</td>
            </tr>
        `;
    }
    
    if (processor2Type === 'mainframe') {
        rows += `
            <tr>
                <td>HP Equivalent (Processor Intensive)</td>
                <td>N/A</td>
                <td>${processor2.processorIntensiveEquivalent}</td>
            </tr>
            <tr>
                <td>HP Equivalent (Commercial)</td>
                <td>N/A</td>
                <td>${processor2.commercialEquivalent}</td>
            </tr>
            <tr>
                <td>HP Equivalent (Business Intelligence)</td>
                <td>N/A</td>
                <td>${processor2.biEquivalent}</td>
            </tr>
        `;
    }
    
    tableBody.innerHTML = rows;
}

// Update charts
function updateCharts(processor1, processor2, processor1Type, processor2Type, workloadType) {
    // Get workload object
    const workload = workloadData.workloadTypes.find(w => w.id === workloadType);
    if (!workload) return;
    
    // Prepare color variables for charts
    const processor1Color = processor1Type === 'power' ? 'rgba(15, 98, 254, 1)' : processor1Type === 'intel' ? 'rgba(0, 113, 197, 1)' : 'rgba(102, 51, 153, 1)';
    const processor2Color = processor2Type === 'power' ? 'rgba(15, 98, 254, 1)' : processor2Type === 'intel' ? 'rgba(0, 113, 197, 1)' : 'rgba(102, 51, 153, 1)';
    
    const processor1ColorBg = processor1Type === 'power' ? 'rgba(15, 98, 254, 0.2)' : processor1Type === 'intel' ? 'rgba(0, 113, 197, 0.2)' : 'rgba(102, 51, 153, 0.2)';
    const processor2ColorBg = processor2Type === 'power' ? 'rgba(15, 98, 254, 0.2)' : processor2Type === 'intel' ? 'rgba(0, 113, 197, 0.2)' : 'rgba(102, 51, 153, 0.2)';
    
    // Update radar chart
    if (processor1Type !== 'mainframe' && processor2Type !== 'mainframe') {
        // Create radar chart for non-mainframe processors
        const radarCtx = document.getElementById('radar-chart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (window.radarChart) {
            window.radarChart.destroy();
        }
        
        window.radarChart = new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: ['Single-Thread', 'Multi-Thread', 'Virtualization', 'Database', 'AI/ML', 'HPC', 'General'],
                datasets: [{
                    label: processor1.name,
                    backgroundColor: processor1ColorBg,
                    borderColor: processor1Color,
                    pointBackgroundColor: processor1Color,
                    data: [
                        processor1.singleThreadScore,
                        processor1.multiThreadScore / 100,
                        processor1.virtualizationScore,
                        processor1.databaseScore,
                        processor1.aiScore,
                        processor1.hpcScore,
                        processor1.generalScore
                    ]
                }, {
                    label: processor2.name,
                    backgroundColor: processor2ColorBg,
                    borderColor: processor2Color,
                    pointBackgroundColor: processor2Color,
                    data: [
                        processor2.singleThreadScore,
                        processor2.multiThreadScore / 100,
                        processor2.virtualizationScore,
                        processor2.databaseScore,
                        processor2.aiScore,
                        processor2.hpcScore,
                        processor2.generalScore
                    ]
                }]
            },
            options: {
                scale: {
                    ticks: {
                        beginAtZero: true,
                        max: 200
                    }
                },
                title: {
                    display: true,
                    text: 'Performance Comparison by Workload Type'
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            const dataset = data.datasets[tooltipItem.datasetIndex];
                            const value = dataset.data[tooltipItem.index];
                            
                            // For Multi-Thread, adjust the display value
                            if (tooltipItem.index === 1) {
                                return `${dataset.label}: ${value * 100}`;
                            }
                            
                            return `${dataset.label}: ${value}`;
                        }
                    }
                }
            }
        });
    } else {
        // For mainframe comparison, show a simpler chart
        const radarCtx = document.getElementById('radar-chart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (window.radarChart) {
            window.radarChart.destroy();
        }
        
        // For mainframe processors, create a different type of chart (e.g., bar chart)
        const processor1Name = processor1.name;
        const processor2Name = processor2.name;
        
        let processor1Data, processor2Data;
        
        if (processor1Type === 'mainframe' && processor2Type === 'mainframe') {
            // Both are mainframe processors
            processor1Data = [processor1.mips, processor1.mipsPerCore];
            processor2Data = [processor2.mips, processor2.mipsPerCore];
        } else if (processor1Type === 'mainframe') {
            // processor1 is mainframe, processor2 is not
            processor1Data = [processor1.mips, processor1.cores];
            processor2Data = [processor2.multiThreadScore, processor2.cores];
        } else {
            // processor2 is mainframe, processor1 is not
            processor1Data = [processor1.multiThreadScore, processor1.cores];
            processor2Data = [processor2.mips, processor2.cores];
        }
        
        window.radarChart = new Chart(radarCtx, {
            type: 'bar',
            data: {
                labels: processor1Type === 'mainframe' && processor2Type === 'mainframe' ? 
                        ['Total MIPS', 'MIPS per Core'] : 
                        processor1Type === 'mainframe' ? 
                        ['MIPS / Multi-Thread Score', 'Cores'] :
                        ['Multi-Thread Score / MIPS', 'Cores'],
                datasets: [{
                    label: processor1Name,
                    backgroundColor: processor1Color,
                    data: processor1Data
                }, {
                    label: processor2Name,
                    backgroundColor: processor2Color,
                    data: processor2Data
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Processor Comparison'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }
    
    // Update single-thread performance chart
    const singleThreadCtx = document.getElementById('single-thread-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.singleThreadChart) {
        window.singleThreadChart.destroy();
    }
    
    let singleThreadData = [];
    
    if (processor1Type !== 'mainframe') {
        singleThreadData.push({
            label: processor1.name,
            backgroundColor: processor1Color,
            data: [processor1.singleThreadScore]
        });
    }
    
    if (processor2Type !== 'mainframe') {
        singleThreadData.push({
            label: processor2.name,
            backgroundColor: processor2Color,
            data: [processor2.singleThreadScore]
        });
    }
    
    if (singleThreadData.length > 0) {
        window.singleThreadChart = new Chart(singleThreadCtx, {
            type: 'bar',
            data: {
                labels: ['Single-Thread Performance'],
                datasets: singleThreadData
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }
    
    // Update multi-thread performance chart
    const multiThreadCtx = document.getElementById('multi-thread-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.multiThreadChart) {
        window.multiThreadChart.destroy();
    }
    
    let multiThreadLabel = 'Multi-Thread Performance';
    let multiThreadData = [];
    
    if (processor1Type === 'mainframe' && processor2Type === 'mainframe') {
        multiThreadLabel = 'Total MIPS';
        multiThreadData = [{
            label: processor1.name,
            backgroundColor: processor1Color,
            data: [processor1.mips]
        }, {
            label: processor2.name,
            backgroundColor: processor2Color,
            data: [processor2.mips]
        }];
    } else if (processor1Type === 'mainframe') {
        multiThreadLabel = 'MIPS vs Multi-Thread Score';
        multiThreadData = [{
            label: processor1.name + ' (MIPS)',
            backgroundColor: processor1Color,
            data: [processor1.mips]
        }, {
            label: processor2.name + ' (Score)',
            backgroundColor: processor2Color,
            data: [processor2.multiThreadScore]
        }];
    } else if (processor2Type === 'mainframe') {
        multiThreadLabel = 'Multi-Thread Score vs MIPS';
        multiThreadData = [{
            label: processor1.name + ' (Score)',
            backgroundColor: processor1Color,
            data: [processor1.multiThreadScore]
        }, {
            label: processor2.name + ' (MIPS)',
            backgroundColor: processor2Color,
            data: [processor2.mips]
        }];
    } else {
        multiThreadData = [{
            label: processor1.name,
            backgroundColor: processor1Color,
            data: [processor1.multiThreadScore]
        }, {
            label: processor2.name,
            backgroundColor: processor2Color,
            data: [processor2.multiThreadScore]
        }];
    }
    
    window.multiThreadChart = new Chart(multiThreadCtx, {
        type: 'bar',
        data: {
            labels: [multiThreadLabel],
            datasets: multiThreadData
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

// Calculate migration sizing
function calculateMigrationSizing() {
    // Get input values
    const sourceMips = parseInt(document.getElementById('source-mips').value);
    const sourceUtilization = parseInt(document.getElementById('source-utilization').value);
    const workloadTypeId = document.getElementById('migration-workload-type').value;
    const targetPlatform = document.getElementById('migration-target-platform').value;
    
    // Validate inputs
    if (isNaN(sourceMips) || sourceMips <= 0) {
        showError('Please enter a valid MIPS capacity (must be a positive number).');
        return;
    }
    
    if (isNaN(sourceUtilization) || sourceUtilization <= 0 || sourceUtilization > 100) {
        showError('Please enter a valid utilization percentage (between 1 and 100).');
        return;
    }
    
    if (!workloadTypeId) {
        showError('Please select a workload type.');
        return;
    }
    
    if (!targetPlatform) {
        showError('Please select a target platform.');
        return;
    }
    
    // Get workload factor
    let workloadFactor;
    
    if (workloadTypeId === 'custom') {
        // Calculate custom workload factor
        const processorIntensivePercent = parseInt(document.getElementById('custom-processor-intensive').value) || 0;
        const tpcCPercent = parseInt(document.getElementById('custom-tpc-c').value) || 0;
        const commercialPercent = parseInt(document.getElementById('custom-commercial').value) || 0;
        const mixedPercent = parseInt(document.getElementById('custom-mixed').value) || 0;
        const biPercent = parseInt(document.getElementById('custom-bi').value) || 0;
        
        const total = processorIntensivePercent + tpcCPercent + commercialPercent + mixedPercent + biPercent;
        
        if (total !== 100) {
            showError('Custom workload mix must add up to 100%.');
            return;
        }
        
        workloadFactor = (
            (processorIntensivePercent * 30) +
            (tpcCPercent * 75) +
            (commercialPercent * 120) +
            (mixedPercent * 160) +
            (biPercent * 200)
        ) / 100;
    } else {
        const workload = workloadData.workloadTypes.find(w => w.id === workloadTypeId);
        if (!workload) {
            showError('Invalid workload type.');
            return;
        }
        
        workloadFactor = workload.tpmPerMips;
    }
    
    // Calculate required tpm
    const requiredTpm = sourceMips * workloadFactor * (sourceUtilization / 100);
    
    // Calculate required processors
    const itaniumMipsPerCore = workloadData.migrationSizing.conversionFactors.itaniumMipsPerCore;
    const xeonMipsPerCore = workloadData.migrationSizing.conversionFactors.xeonMipsPerCore;
    
    const requiredItaniumCores = Math.ceil(sourceMips * (sourceUtilization / 100) / itaniumMipsPerCore);
    const requiredXeonCores = Math.ceil(sourceMips * (sourceUtilization / 100) / xeonMipsPerCore);
    
    // Update results UI
    updateMigrationResults(
        sourceMips,
        sourceUtilization,
        workloadFactor,
        requiredTpm,
        requiredItaniumCores,
        requiredXeonCores,
        targetPlatform,
        workloadTypeId
    );
    
    // Show results
    document.getElementById('migration-results').classList.remove('hidden');
    
    // Scroll to results
    document.getElementById('migration-results').scrollIntoView({ behavior: 'smooth' });
}

// Update migration results UI
function updateMigrationResults(
    sourceMips,
    sourceUtilization,
    workloadFactor,
    requiredTpm,
    requiredItaniumCores,
    requiredXeonCores,
    targetPlatform,
    workloadTypeId
) {
    // Get workload name
    let workloadName;
    if (workloadTypeId === 'custom') {
        workloadName = 'Custom Workload Mix';
    } else {
        const workload = workloadData.workloadTypes.find(w => w.id === workloadTypeId);
        workloadName = workload ? workload.name : 'Unknown Workload';
    }
    
    // Update summary
    const migrationSummary = document.getElementById('migration-summary');
    migrationSummary.innerHTML = `
        <p class="mb-2">For a mainframe workload of <strong>${sourceMips} MIPS</strong> at <strong>${sourceUtilization}%</strong> utilization, 
        with a <strong>${workloadName}</strong> workload type (${workloadFactor} tpm/MIPS), the migration sizing results are:</p>
        <p>Total required transactions per minute (tpm): <strong>${Math.round(requiredTpm).toLocaleString()}</strong></p>
    `;
    
    // Show/hide platform results based on selection
    const powerResults = document.getElementById('power-migration-results');
    const intelResults = document.getElementById('intel-migration-results');
    
    if (targetPlatform === 'power' || targetPlatform === 'both') {
        powerResults.classList.remove('hidden');
        
        // Update POWER sizing details
        const powerSizingDetails = document.getElementById('power-sizing-details');
        powerSizingDetails.innerHTML = `
            <p class="mb-2">Required IBM POWER cores: <strong>${requiredItaniumCores}</strong></p>
            <p class="mb-2">Based on a conversion factor of <strong>${itaniumMipsPerCore} MIPS per core</strong> for Itanium processors.</p>
            
            <div class="mt-4">
                <h4 class="font-semibold mb-2">Recommended POWER Configuration:</h4>
                ${getRecommendedPowerConfiguration(requiredItaniumCores)}
            </div>
            
            <div class="mt-4 p-3 bg-blue-50 rounded">
                <h4 class="font-semibold mb-1">POWER Advantages for this Workload:</h4>
                <ul class="list-disc list-inside text-sm">
                    ${getPowerAdvantages(workloadTypeId)}
                </ul>
            </div>
        `;
    } else {
        powerResults.classList.add('hidden');
    }
    
    if (targetPlatform === 'intel' || targetPlatform === 'both') {
        intelResults.classList.remove('hidden');
        
        // Update Intel sizing details
        const intelSizingDetails = document.getElementById('intel-sizing-details');
        intelSizingDetails.innerHTML = `
            <p class="mb-2">Required Intel x86 cores: <strong>${requiredXeonCores}</strong></p>
            <p class="mb-2">Based on a conversion factor of <strong>${xeonMipsPerCore} MIPS per core</strong> for Xeon processors.</p>
            
            <div class="mt-4">
                <h4 class="font-semibold mb-2">Recommended Intel Configuration:</h4>
                ${getRecommendedIntelConfiguration(requiredXeonCores)}
            </div>
            
            <div class="mt-4 p-3 bg-blue-50 rounded">
                <h4 class="font-semibold mb-1">Intel x86 Advantages for this Workload:</h4>
                <ul class="list-disc list-inside text-sm">
                    ${getIntelAdvantages(workloadTypeId)}
                </ul>
            </div>
        `;
    } else {
        intelResults.classList.add('hidden');
    }
}

// Get recommended POWER configuration based on required cores
function getRecommendedPowerConfiguration(requiredCores) {
    let recommendation = '';
    
    if (requiredCores <= 4) {
        recommendation = `
            <ul class="list-disc list-inside">
                <li>IBM Power S1022 (2-socket, 2-core per socket)</li>
                <li>PowerVM for virtualization</li>
                <li>16 GB RAM per core recommended</li>
            </ul>
        `;
    } else if (requiredCores <= 16) {
        recommendation = `
            <ul class="list-disc list-inside">
                <li>IBM Power S1024 (2-socket, 8-core per socket)</li>
                <li>PowerVM for virtualization</li>
                <li>16-32 GB RAM per core recommended</li>
            </ul>
        `;
    } else if (requiredCores <= 32) {
        recommendation = `
            <ul class="list-disc list-inside">
                <li>IBM Power E1050 (4-socket, 8-core per socket)</li>
                <li>PowerVM for virtualization</li>
                <li>32 GB RAM per core recommended</li>
            </ul>
        `;
    } else {
        recommendation = `
            <ul class="list-disc list-inside">
                <li>IBM Power E1080 (4-socket or higher, multiple systems if needed)</li>
                <li>PowerVM for virtualization</li>
                <li>32-64 GB RAM per core recommended</li>
                <li>Consider a multi-system implementation for high availability</li>
            </ul>
        `;
    }
    
    return recommendation;
}

// Get recommended Intel configuration based on required cores
function getRecommendedIntelConfiguration(requiredCores) {
    let recommendation = '';
    
    if (requiredCores <= 8) {
        recommendation = `
            <ul class="list-disc list-inside">
                <li>Dell PowerEdge R650 or HPE ProLiant DL360 (2-socket, 4-core per socket)</li>
                <li>VMware vSphere or Microsoft Hyper-V for virtualization</li>
                <li>16 GB RAM per core recommended</li>
            </ul>
        `;
    } else if (requiredCores <= 32) {
        recommendation = `
            <ul class="list-disc list-inside">
                <li>Dell PowerEdge R750 or HPE ProLiant DL380 (2-socket, 16-core per socket)</li>
                <li>VMware vSphere or Microsoft Hyper-V for virtualization</li>
                <li>16-32 GB RAM per core recommended</li>
            </ul>
        `;
    } else if (requiredCores <= 64) {
        recommendation = `
            <ul class="list-disc list-inside">
                <li>Dell PowerEdge R760 or HPE ProLiant DL580 (4-socket, 16-core per socket)</li>
                <li>VMware vSphere or Microsoft Hyper-V for virtualization</li>
                <li>32 GB RAM per core recommended</li>
            </ul>
        `;
    } else {
        recommendation = `
            <ul class="list-disc list-inside">
                <li>Multiple Dell PowerEdge R760 or HPE ProLiant DL580 servers (4-socket, 16-core per socket)</li>
                <li>VMware vSphere or Microsoft Hyper-V for virtualization</li>
                <li>32-64 GB RAM per core recommended</li>
                <li>Consider a clustered implementation for high availability</li>
            </ul>
        `;
    }
    
    return recommendation;
}

// Get POWER advantages based on workload type
function getPowerAdvantages(workloadTypeId) {
    let advantages = '';
    
    switch (workloadTypeId) {
        case 'processor-intensive':
            advantages = `
                <li>SMT-8 technology for efficient thread processing</li>
                <li>High per-core performance</li>
                <li>Excellent scaling for compute-intensive tasks</li>
                <li>Optimized for scientific and technical workloads</li>
            `;
            break;
        case 'tpc-c':
        case 'commercial':
            advantages = `
                <li>Excellent transaction processing performance</li>
                <li>High memory bandwidth for database operations</li>
                <li>Built-in RAS features for high availability</li>
                <li>PowerVM for secure workload isolation</li>
                <li>Mainframe-inspired virtualization capabilities</li>
            `;
            break;
        case 'mixed':
            advantages = `
                <li>Balanced design for mixed workloads</li>
                <li>Good batch and online transaction processing</li>
                <li>Advanced workload management features</li>
                <li>Shared processor pools for efficient resource utilization</li>
            `;
            break;
        case 'business-intelligence':
            advantages = `
                <li>High memory bandwidth for data analytics</li>
                <li>Matrix Math Accelerator for AI operations</li>
                <li>Excellent I/O throughput for data-intensive operations</li>
                <li>Strong scaling for large data warehousing workloads</li>
            `;
            break;
        default:
            advantages = `
                <li>High performance across a wide range of workloads</li>
                <li>Advanced virtualization with PowerVM</li>
                <li>Strong RAS features for enterprise workloads</li>
                <li>Optimized for critical business applications</li>
            `;
    }
    
    return advantages;
}

// Continuation of comparison-tool-script.js

// Complete the Intel advantages function (which was cut off)
function getIntelAdvantages(workloadTypeId) {
    let advantages = '';
    
    switch (workloadTypeId) {
        case 'processor-intensive':
            advantages = `
                <li>Cost-effective compute capacity</li>
                <li>Broad software ecosystem optimized for x86</li>
                <li>Wide range of server options from multiple vendors</li>
                <li>Extensive developer tools and libraries</li>
            `;
            break;
        case 'tpc-c':
        case 'commercial':
            advantages = `
                <li>Good performance for commercial applications</li>
                <li>Lower acquisition cost than POWER or mainframe</li>
                <li>Extensive enterprise software support</li>
                <li>Multiple virtualization options (VMware, Hyper-V, KVM)</li>
            `;
            break;
        case 'mixed':
            advantages = `
                <li>Balanced performance for varied workloads</li>
                <li>Extensive software ecosystem</li>
                <li>Good scalability options from small to large systems</li>
                <li>Familiar management tools and interfaces</li>
            `;
            break;
        case 'business-intelligence':
            advantages = `
                <li>Cost-effective platform for data analytics</li>
                <li>AVX-512 and other SIMD instructions for analytics</li>
                <li>Extensive BI tool support</li>
                <li>Wide range of storage options for data warehousing</li>
            `;
            break;
        default:
            advantages = `
                <li>Cost-effective platform for general workloads</li>
                <li>Extensive software ecosystem</li>
                <li>Multiple vendor options</li>
                <li>Familiar management and administration</li>
                <li>Good performance across most workload types</li>
            `;
    }
    
    return advantages;
}

// Show error message to user
function showError(message) {
    // Create error element if it doesn't exist
    let errorElement = document.getElementById('error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'error-message';
        errorElement.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md shadow-lg';
        errorElement.style.zIndex = '1000';
        document.body.appendChild(errorElement);
    }
    
    // Set error message
    errorElement.innerHTML = `
        <div class="flex items-center">
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <span>${message}</span>
        </div>
        <span class="absolute top-0 right-0 px-2 py-1 cursor-pointer" onclick="this.parentElement.remove()">×</span>
    `;
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorElement && errorElement.parentNode) {
            errorElement.remove();
        }
    }, 5000);
}

// Helper function to check if object is empty
function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}

// Helper function to format large numbers with commas
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Helper function to format data size (KB, MB, GB)
function formatDataSize(size) {
    if (size >= 1024 * 1024) {
        return (size / (1024 * 1024)).toFixed(2) + ' MB';
    } else if (size >= 1024) {
        return (size / 1024).toFixed(2) + ' KB';
    } else {
        return size + ' bytes';
    }
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Initialize custom tooltips
function initializeTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            
            const tooltipElement = document.createElement('div');
            tooltipElement.className = 'absolute bg-gray-800 text-white text-sm rounded py-1 px-2 z-50 max-w-xs';
            tooltipElement.textContent = tooltipText;
            
            // Position tooltip above the element
            const rect = this.getBoundingClientRect();
            tooltipElement.style.top = (rect.top - 30) + 'px';
            tooltipElement.style.left = (rect.left + rect.width / 2 - 100) + 'px';
            
            document.body.appendChild(tooltipElement);
            
            this.addEventListener('mouseleave', function() {
                tooltipElement.remove();
            });
        });
    });
}

// Handle responsive design adjustments
function handleResponsiveLayout() {
    const updateLayout = () => {
        const width = window.innerWidth;
        
        // Adjust layout for mobile devices
        if (width < 768) {
            // Mobile adjustments
            document.querySelectorAll('.processor-col').forEach(col => {
                col.classList.add('mb-4');
            });
        } else {
            // Desktop adjustments
            document.querySelectorAll('.processor-col').forEach(col => {
                col.classList.remove('mb-4');
            });
        }
    };
    
    // Initial call
    updateLayout();
    
    // Add resize listener
    window.addEventListener('resize', updateLayout);
}

// Handle dark mode toggle if supported by browser
function initializeDarkMode() {
    // Check if the browser supports dark mode detection
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const toggleDarkMode = (isDarkMode) => {
            if (isDarkMode) {
                document.documentElement.classList.add('dark-mode');
            } else {
                document.documentElement.classList.remove('dark-mode');
            }
        };
        
        // Initial check
        toggleDarkMode(darkModeMediaQuery.matches);
        
        // Listen for changes
        darkModeMediaQuery.addEventListener('change', (e) => {
            toggleDarkMode(e.matches);
        });
    }
}

// Function to calculate workload equivalence
function calculateWorkloadEquivalence(processor1, processor2, processor1Type, processor2Type, workloadFactor) {
    let processor1Performance, processor2Performance;
    
    if (processor1Type === 'mainframe') {
        processor1Performance = processor1.mips;
    } else {
        processor1Performance = processor1.multiThreadScore;
    }
    
    if (processor2Type === 'mainframe') {
        processor2Performance = processor2.mips;
    } else {
        processor2Performance = processor2.multiThreadScore;
    }
    
    // For mainframe to non-mainframe comparison, apply workload factor
    if (processor1Type === 'mainframe' && processor2Type !== 'mainframe') {
        processor1Performance = processor1.mips * (workloadFactor / 120); // Normalize to commercial workload
    } else if (processor1Type !== 'mainframe' && processor2Type === 'mainframe') {
        processor2Performance = processor2.mips * (workloadFactor / 120); // Normalize to commercial workload
    }
    
    return {
        processor1Performance,
        processor2Performance,
        ratio: processor1Performance / processor2Performance
    };
}

// Initialize comparison tool settings
function initializeSettings() {
    // Check for saved preferences in localStorage
    const savedWorkloadType = localStorage.getItem('preferredWorkloadType');
    if (savedWorkloadType) {
        const workloadSelect = document.getElementById('workload-type');
        if (workloadSelect) {
            workloadSelect.value = savedWorkloadType;
            
            // Trigger change event to update workload info
            const event = new Event('change');
            workloadSelect.dispatchEvent(event);
        }
    }
    
    // Add event listener to save preferences
    document.getElementById('workload-type').addEventListener('change', function() {
        localStorage.setItem('preferredWorkloadType', this.value);
    });
}

// Call initialization functions
document.addEventListener('DOMContentLoaded', function() {
    handleResponsiveLayout();
    initializeDarkMode();
    initializeTooltips();
    initializeSettings();
});

// Add download functionality for comparison results
function addExportFunctionality() {
    // Create export button
    const exportButton = document.createElement('button');
    exportButton.className = 'py-2 px-4 bg-green-600 text-white font-semibold rounded hover:bg-green-700 focus:outline-none mt-4';
    exportButton.textContent = 'Export Comparison Results';
    exportButton.addEventListener('click', exportComparisonResults);
    
    // Add button to the results section
    const resultsSection = document.getElementById('comparison-results');
    if (resultsSection) {
        resultsSection.appendChild(exportButton);
    }
}

// Export comparison results as text
function exportComparisonResults() {
    const summaryText = document.getElementById('summary-text').innerText;
    const tableRows = document.querySelectorAll('#comparison-table-body tr');
    
    let exportText = "PROCESSOR COMPARISON RESULTS\n";
    exportText += "==============================\n\n";
    exportText += "Summary:\n";
    exportText += summaryText + "\n\n";
    exportText += "Detailed Comparison:\n";
    exportText += "==============================\n";
    
    tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 3) {
            exportText += `${cells[0].innerText}: ${cells[1].innerText} vs ${cells[2].innerText}\n`;
        }
    });
    
    exportText += "\n==============================\n";
    exportText += "Generated by Processor Architecture Comparison Tool";
    
    // Create download link
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'processor-comparison-results.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// Add feedback functionality
function initializeFeedbackSystem() {
    // Create feedback button
    const feedbackButton = document.createElement('button');
    feedbackButton.className = 'fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-3 shadow-lg z-50';
    feedbackButton.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
        </svg>
    `;
    
    // Add tooltip
    feedbackButton.setAttribute('data-tooltip', 'Send Feedback');
    
    feedbackButton.addEventListener('click', showFeedbackForm);
    
    document.body.appendChild(feedbackButton);
}

// Show feedback form
function showFeedbackForm() {
    const feedbackModal = document.createElement('div');
    feedbackModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    feedbackModal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 class="text-xl font-bold mb-4">Send Feedback</h3>
            <p class="mb-4">We appreciate your feedback on the Processor Architecture Comparison Tool.</p>
            
            <form id="feedback-form">
                <div class="mb-4">
                    <label class="block text-gray-700 mb-2" for="feedback-type">Feedback Type</label>
                    <select id="feedback-type" class="w-full p-2 border rounded">
                        <option value="suggestion">Suggestion</option>
                        <option value="bug">Bug Report</option>
                        <option value="feature">Feature Request</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div class="mb-4">
                    <label class="block text-gray-700 mb-2" for="feedback-message">Message</label>
                    <textarea id="feedback-message" class="w-full p-2 border rounded h-32" placeholder="Please describe your feedback..."></textarea>
                </div>
                
                <div class="flex justify-end">
                    <button type="button" class="py-2 px-4 bg-gray-400 text-white font-semibold rounded hover:bg-gray-500 focus:outline-none mr-2" id="cancel-feedback">Cancel</button>
                    <button type="submit" class="py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none">Send Feedback</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(feedbackModal);
    
    // Handle cancel button
    document.getElementById('cancel-feedback').addEventListener('click', () => {
        feedbackModal.remove();
    });
    
    // Handle form submission
    document.getElementById('feedback-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const feedbackType = document.getElementById('feedback-type').value;
        const feedbackMessage = document.getElementById('feedback-message').value;
        
        // Here you would typically send this data to a server endpoint
        // For this demo, we'll just show a thank you message
        
        feedbackModal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 class="text-xl font-bold mb-4">Thank You!</h3>
                <p class="mb-4">Your feedback has been received. We appreciate your input.</p>
                
                <div class="flex justify-end">
                    <button type="button" class="py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none" id="close-feedback">Close</button>
                </div>
            </div>
        `;
        
        document.getElementById('close-feedback').addEventListener('click', () => {
            feedbackModal.remove();
        });
    });
}

// Helper function to generate print-friendly version of results
function printComparisonResults() {
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    // Get comparison data
    const summaryText = document.getElementById('summary-text').innerHTML;
    
    // Create print content
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Processor Comparison Results</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                h1, h2, h3 {
                    color: #0062ff;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }
                .date {
                    color: #666;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 0.9em;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Processor Comparison Results</h1>
                <p class="date">Generated: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <h2>Summary</h2>
            <p>${summaryText}</p>
            
            <h2>Detailed Comparison</h2>
            <table>
                <thead>
                    <tr>
                        <th>Specification</th>
                        <th>${document.getElementById('details-col1-header').textContent}</th>
                        <th>${document.getElementById('details-col2-header').textContent}</th>
                    </tr>
                </thead>
                <tbody>
                    ${document.getElementById('comparison-table-body').innerHTML}
                </tbody>
            </table>
            
            <div class="footer">
                <p>Generated by Processor Architecture Comparison Tool</p>
            </div>
            
            <script>
                // Auto print
                window.onload = function() {
                    window.print();
                }
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// Add print button to comparison results
function addPrintFunctionality() {
    // Create print button
    const printButton = document.createElement('button');
    printButton.className = 'py-2 px-4 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 focus:outline-none mt-4 ml-2';
    printButton.textContent = 'Print Results';
    printButton.addEventListener('click', printComparisonResults);
    
    // Add button to the results section
    const resultsSection = document.getElementById('comparison-results');
    if (resultsSection) {
        resultsSection.appendChild(printButton);
    }
}

// Initialize export and print functionality
document.addEventListener('DOMContentLoaded', function() {
    addExportFunctionality();
    addPrintFunctionality();
    initializeFeedbackSystem();
});
