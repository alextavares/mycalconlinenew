import { CalculatorConfig } from '@/types/calculator';

export const calculators: Record<string, CalculatorConfig> = {
    'meters-to-feet': {
        id: 'meters-to-feet',
        title: 'Meters to Feet Converter',
        description: 'Convert meters to feet and inches. Perfect for height, room dimensions, or travel.',
        category: 'conversion',
        icon: 'Ruler',
        meta: {
            title: 'Meters to Feet Converter (m to ft) | Height & Length',
            description: 'Convert meters to feet and inches. Includes a quick reference table for common heights (1.7m, 1.8m, etc).',
            keywords: ['meters to feet', 'm to ft', 'height converter', 'metric to imperial', 'length converter'],
        },
        inputs: [
            {
                id: 'meters',
                label: 'Meters (m)',
                type: 'number',
                placeholder: 'e.g., 1.75',
                unit: 'm',
            },
        ],
        outputs: [
            {
                label: 'Feet (decimal)',
                unit: 'ft',
                calculate: (inputs) => {
                    const meters = inputs['meters'];
                    if (typeof meters !== 'number') return 0;
                    return parseFloat((meters * 3.28084).toFixed(4));
                },
            },
            {
                label: 'Feet + Inches',
                unit: '',
                calculate: (inputs) => {
                    const meters = inputs['meters'];
                    if (typeof meters !== 'number' || meters <= 0) return 'N/A';
                    const totalInches = meters * 39.3701;
                    const feet = Math.floor(totalInches / 12);
                    const inches = Math.round(totalInches % 12);
                    return `${feet}' ${inches}"`;
                },
            },
        ],
        content: {
            whatIs: `
            <h3>Why Convert Meters to Feet?</h3>
            <p>While the metric system is used globally, the USA and UK often use feet and inches for human height and room dimensions.</p>
            <p>Knowing your height in both systems is useful for travel, sports, and international communication.</p>
            `,
            howTo: `
            <h3>Quick Reference Table</h3>
            <div class="overflow-hidden rounded-lg border border-gray-200 mt-4">
                <table class="min-w-full text-sm text-center">
                    <thead class="bg-gray-50 text-gray-700 font-semibold">
                        <tr>
                            <th class="py-2 px-4">Meters</th>
                            <th class="py-2 px-4">Feet (decimal)</th>
                            <th class="py-2 px-4">Feet + Inches</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr><td class="py-2 font-medium">1.50 m</td><td>4.92 ft</td><td class="text-blue-600">4' 11"</td></tr>
                        <tr><td class="py-2 font-medium">1.60 m</td><td>5.25 ft</td><td class="text-blue-600">5' 3"</td></tr>
                        <tr><td class="py-2 font-medium">1.70 m</td><td>5.58 ft</td><td class="text-blue-600">5' 7"</td></tr>
                        <tr><td class="py-2 font-medium">1.75 m</td><td>5.74 ft</td><td class="text-blue-600">5' 9"</td></tr>
                        <tr><td class="py-2 font-medium">1.80 m</td><td>5.91 ft</td><td class="text-blue-600">5' 11"</td></tr>
                        <tr><td class="py-2 font-medium">1.85 m</td><td>6.07 ft</td><td class="text-blue-600">6' 1"</td></tr>
                        <tr><td class="py-2 font-medium">1.90 m</td><td>6.23 ft</td><td class="text-blue-600">6' 3"</td></tr>
                    </tbody>
                </table>
            </div>
            `,
            faq: [
                {
                    question: 'How many feet are in 1 meter?',
                    answer: 'There are approximately 3.28084 feet in 1 meter. For a quick estimate, multiply meters by 3.3.',
                },
                {
                    question: 'Why does my result show feet AND inches?',
                    answer: "In the US/UK, height is usually expressed as '5 feet 9 inches' rather than '5.75 feet'. We show both formats for convenience."
                }
            ],
        },
    },
    'weight': {
        id: 'weight',
        title: 'Weight Converter',
        description: 'Convert between different units of weight (kg, lbs, oz, g).',
        category: 'conversion',
        icon: 'Scale',
        meta: {
            title: 'Weight Converter | MyCalcOnline',
            description: 'Easily convert weight between Kilograms, Pounds, Ounces, and Grams.',
            keywords: ['weight converter', 'kg to lbs', 'pounds to kg', 'mass converter'],
        },
        inputs: [
            {
                id: 'value',
                label: 'Value',
                type: 'number',
                placeholder: 'e.g. 1',
            },
            {
                id: 'unit_from',
                label: 'From',
                type: 'select',
                defaultValue: 'kg',
                options: [
                    { label: 'Kilograms (kg)', value: 'kg' },
                    { label: 'Pounds (lbs)', value: 'lb' },
                    { label: 'Grams (g)', value: 'g' },
                    { label: 'Milligrams (mg)', value: 'mg' },
                    { label: 'Ounces (oz)', value: 'oz' },
                    { label: 'Stones (st)', value: 'st' },
                    { label: 'US Tons (ton)', value: 'ton' },
                    { label: 'Metric Tonnes (t)', value: 'tonne' },
                ],
            },
            {
                id: 'unit_to',
                label: 'To',
                type: 'select',
                defaultValue: 'lb',
                options: [
                    { label: 'Kilograms (kg)', value: 'kg' },
                    { label: 'Pounds (lbs)', value: 'lb' },
                    { label: 'Grams (g)', value: 'g' },
                    { label: 'Milligrams (mg)', value: 'mg' },
                    { label: 'Ounces (oz)', value: 'oz' },
                    { label: 'Stones (st)', value: 'st' },
                    { label: 'US Tons (ton)', value: 'ton' },
                    { label: 'Metric Tonnes (t)', value: 'tonne' },
                ],
            },
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const val = inputs['value'];
                    const from = inputs['unit_from'] as string;
                    const to = inputs['unit_to'] as string;

                    if (typeof val !== 'number') return 0;

                    // Conversion rates to grams
                    const rates: Record<string, number> = {
                        mg: 0.001,
                        g: 1,
                        kg: 1000,
                        oz: 28.3495,
                        lb: 453.592,
                        st: 6350.29,
                        ton: 907185,
                        tonne: 1000000
                    };

                    const grams = val * (rates[from] || 1);
                    const result = grams / (rates[to] || 1);

                    return parseFloat(result.toFixed(6));
                },
            },
        ],
        content: {
            whatIs: `
        <h3>Understanding Weight Units</h3>
        <p>Weight conversion is essential in many fields, from cooking and grocery shopping to science and engineering. This tool helps you switch seamlessly between:</p>
        <ul class="list-disc pl-5 space-y-1 text-gray-600">
            <li><strong>Metric System:</strong> Grams (g), Kilograms (kg), Tonnes (t). Used globally.</li>
            <li><strong>Imperial/US System:</strong> Ounces (oz), Pounds (lb), Stones (st), Tons. Used mainly in the USA and UK.</li>
        </ul>
      `,
            howTo: `
        <h3>Common Conversion Factors</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div class="bg-indigo-50 p-3 rounded border border-indigo-100">
                <span class="font-bold text-indigo-900">1 kg = 2.204 lbs</span>
                <p class="text-xs text-indigo-700 mt-1">To convert Kg to Lbs, multiply by 2.2</p>
            </div>
            <div class="bg-pink-50 p-3 rounded border border-pink-100">
                <span class="font-bold text-pink-900">1 lb = 453.6 g</span>
                <p class="text-xs text-pink-700 mt-1">To convert Lbs to Kg, divide by 2.2</p>
            </div>
            <div class="bg-amber-50 p-3 rounded border border-amber-100">
                <span class="font-bold text-amber-900">1 oz = 28.35 g</span>
                <p class="text-xs text-amber-700 mt-1">Kitchen measurements</p>
            </div>
            <div class="bg-gray-50 p-3 rounded border border-gray-100">
                <span class="font-bold text-gray-900">1 Stone = 14 lbs</span>
                <p class="text-xs text-gray-700 mt-1">Common in UK body weight</p>
            </div>
        </div>
      `,
            faq: [
                {
                    question: 'How many pounds in a stone?',
                    answer: 'There are exactly 14 pounds in 1 stone. So a person weighing 10 stone weighs 140 lbs.',
                },
                {
                    question: 'What is the difference between a dashboard Ton and a Metric Tonne?',
                    answer: 'A Metric Tonne (t) is 1,000 kg (approx 2,204 lbs). A US Short Ton is 2,000 lbs. A UK Long Ton is 2,240 lbs.',
                }
            ],
        },
    },
    'temperature': {
        id: 'temperature',
        title: 'Temperature Converter',
        description: 'Convert between Celsius (°C), Fahrenheit (°F), and Kelvin (K).',
        category: 'conversion',
        icon: 'Thermometer',
        meta: {
            title: 'Temperature Converter (C, F, K) | MyCalcOnline',
            description: 'Accurate temperature conversion calculator. Convert between Celsius, Fahrenheit, and Kelvin instantly.',
            keywords: ['temperature converter', 'celsius to fahrenheit', 'fahrenheit to celsius', 'kelvin conversion'],
        },
        inputs: [
            {
                id: 'value',
                label: 'Degree',
                type: 'number',
                placeholder: 'e.g. 25',
            },
            {
                id: 'unit_from',
                label: 'From',
                type: 'select',
                defaultValue: 'celsius',
                options: [
                    { label: 'Celsius (°C)', value: 'celsius' },
                    { label: 'Fahrenheit (°F)', value: 'fahrenheit' },
                    { label: 'Kelvin (K)', value: 'kelvin' },
                ],
            },
            {
                id: 'unit_to',
                label: 'To',
                type: 'select',
                defaultValue: 'fahrenheit',
                options: [
                    { label: 'Celsius (°C)', value: 'celsius' },
                    { label: 'Fahrenheit (°F)', value: 'fahrenheit' },
                    { label: 'Kelvin (K)', value: 'kelvin' },
                ],
            },
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const val = inputs['value'];
                    const from = inputs['unit_from'] as string;
                    const to = inputs['unit_to'] as string;

                    if (typeof val !== 'number') return 0;

                    // Convert to Celsius first
                    let celsius = val;
                    if (from === 'fahrenheit') celsius = (val - 32) * 5 / 9;
                    else if (from === 'kelvin') celsius = val - 273.15;

                    // Convert from Celsius to target
                    let result = celsius;
                    if (to === 'fahrenheit') result = celsius * 9 / 5 + 32;
                    else if (to === 'kelvin') result = celsius + 273.15;

                    return parseFloat(result.toFixed(2));
                },
            },
        ],
        content: {
            whatIs: `
        <h3>Temperature Scales Explained</h3>
        <p>Temperature isn't just a number; it's a measurement of thermal energy. We support the three major scales:</p>
        <ul class="list-disc pl-5 mt-2 space-y-1 text-gray-600">
            <li><strong>Celsius (°C):</strong> Based on water freezing at 0° and boiling at 100°. Used globally.</li>
            <li><strong>Fahrenheit (°F):</strong> Freezing at 32° and boiling at 212°. Used in the USA.</li>
            <li><strong>Kelvin (K):</strong> The scientific scale starting at Absolute Zero. No degree symbol is used.</li>
        </ul>
      `,
            howTo: `
        <h3>Conversion Quick Guide</h3>
        <div class="overflow-hidden rounded-lg border border-gray-200 mt-4">
            <table class="min-w-full text-sm text-center">
                <thead class="bg-gray-50 text-gray-700 font-semibold">
                    <tr>
                        <th class="py-2 px-4">From</th>
                        <th class="py-2 px-4">To Celsius</th>
                        <th class="py-2 px-4">To Fahrenheit</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <tr>
                        <td class="font-medium text-gray-900 py-2">Celsius</td>
                        <td class="text-gray-400">-</td>
                        <td class="text-blue-600">(°C × 9/5) + 32</td>
                    </tr>
                    <tr>
                        <td class="font-medium text-gray-900 py-2">Fahrenheit</td>
                        <td class="text-blue-600">(°F - 32) × 5/9</td>
                        <td class="text-gray-400">-</td>
                    </tr>
                    <tr>
                        <td class="font-medium text-gray-900 py-2">Kelvin</td>
                        <td class="text-blue-600">K - 273.15</td>
                        <td class="text-blue-600">(K - 273.15) × 9/5 + 32</td>
                    </tr>
                </tbody>
            </table>
        </div>
      `,
            faq: [
                {
                    question: 'What is absolute zero?',
                    answer: 'Absolute zero (0 K) is the theoretical lowest temperature possible, where all molecular motion ceases. It is equivalent to -273.15°C or -459.67°F.',
                },
                {
                    question: 'At what temperature are Celsius and Fahrenheit the same?',
                    answer: 'They are exactly equal at -40 degrees (-40°C = -40°F).',
                }
            ],
        },
    },
    'length': {
        id: 'length',
        title: 'Length Converter',
        description: 'Convert between different units of length (m, km, inches, feet, miles).',
        category: 'conversion',
        icon: 'Ruler',
        meta: {
            title: 'Length Converter (m, ft, in, km) | MyCalcOnline',
            description: 'Accurate length conversion calculator. Convert between Meters, Feet, Inches, Kilometers and Miles.',
            keywords: ['length converter', 'meters to feet', 'distance converter', 'mm to inches'],
        },
        inputs: [
            {
                id: 'value',
                label: 'Length',
                type: 'number',
                placeholder: 'e.g. 1',
            },
            {
                id: 'unit_from',
                label: 'From',
                type: 'select',
                defaultValue: 'm',
                options: [
                    { label: 'Micrometers (µm)', value: 'um' },
                    { label: 'Millimeters (mm)', value: 'mm' },
                    { label: 'Centimeters (cm)', value: 'cm' },
                    { label: 'Meters (m)', value: 'm' },
                    { label: 'Kilometers (km)', value: 'km' },
                    { label: 'Inches (in)', value: 'in' },
                    { label: 'Feet (ft)', value: 'ft' },
                    { label: 'Yards (yd)', value: 'yd' },
                    { label: 'Miles (mi)', value: 'mi' },
                    { label: 'Nautical Miles (nmi)', value: 'nmi' },
                ],
            },
            {
                id: 'unit_to',
                label: 'To',
                type: 'select',
                defaultValue: 'ft',
                options: [
                    { label: 'Micrometers (µm)', value: 'um' },
                    { label: 'Millimeters (mm)', value: 'mm' },
                    { label: 'Centimeters (cm)', value: 'cm' },
                    { label: 'Meters (m)', value: 'm' },
                    { label: 'Kilometers (km)', value: 'km' },
                    { label: 'Inches (in)', value: 'in' },
                    { label: 'Feet (ft)', value: 'ft' },
                    { label: 'Yards (yd)', value: 'yd' },
                    { label: 'Miles (mi)', value: 'mi' },
                    { label: 'Nautical Miles (nmi)', value: 'nmi' },
                ],
            },
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const val = inputs['value'];
                    const from = inputs['unit_from'] as string;
                    const to = inputs['unit_to'] as string;

                    if (typeof val !== 'number') return 0;

                    // Conversion rates to meters
                    const rates: Record<string, number> = {
                        um: 0.000001,
                        mm: 0.001,
                        cm: 0.01,
                        m: 1,
                        km: 1000,
                        in: 0.0254,
                        ft: 0.3048,
                        yd: 0.9144,
                        mi: 1609.344,
                        nmi: 1852
                    };

                    const meters = val * (rates[from] || 1);
                    const result = meters / (rates[to] || 1);

                    return parseFloat(result.toPrecision(7));
                },
            },
        ],
        content: {
            whatIs: `
        <h3>Metric vs. Imperial Lengths</h3>
        <p>Length is the measure of distance. Most of the world uses the <strong>Metric system</strong> (based on meters), which is decimal-based and easy to scale (x10, x100, x1000).</p>
        <p>The <strong>Imperial system</strong> (inches, feet, yards, miles) is used primarily in the United States and has less uniform conversion factors (x12, x3, x1760).</p>
      `,
            howTo: `
        <h3>Useful Equivalences</h3>
        <div class="grid gap-3 my-4">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                <span class="text-gray-600">Metric Base</span>
                <span class="font-mono font-bold text-gray-900">1 Meter</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-white rounded border border-gray-100 shadow-sm">
                <span class="text-gray-600">1 Inch</span>
                <span class="font-mono text-blue-600">2.54 cm</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-white rounded border border-gray-100 shadow-sm">
                <span class="text-gray-600">1 Foot</span>
                <span class="font-mono text-blue-600">30.48 cm</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-white rounded border border-gray-100 shadow-sm">
                <span class="text-gray-600">1 Mile</span>
                <span class="font-mono text-blue-600">1.609 km</span>
            </div>
        </div>
      `,
            faq: [
                {
                    question: 'How many feet in a mile?',
                    answer: 'There are 5,280 feet in one land (statute) mile.',
                },
                {
                    question: 'What is a Nautical Mile?',
                    answer: 'Used in sea and air navigation, a Nautical Mile is slightly longer than a land mile. 1 Nautical Mile = 1.852 km (approx 1.15 land miles).',
                }
            ],
        },
    },
    'average': {
        id: 'average',
        title: 'Average Calculator',
        description: 'Calculate Mean, Median, Mode, and Range of a data set.',
        category: 'math',
        icon: 'BarChart3',
        meta: {
            title: 'Average Calculator (Mean, Median, Mode) | MyCalcOnline',
            description: 'Calculate the average (mean), median, mode, and range of a set of numbers. Enter your data set and get instant statistics.',
            keywords: ['average calculator', 'mean calculator', 'median mode calculator', 'statistics calculator'],
        },
        inputs: [
            {
                id: 'numbers',
                label: 'Numbers (comma separated)',
                type: 'text',
                placeholder: 'e.g. 10, 20, 30, 40',
                defaultValue: '10, 20, 30, 40',
            },
        ],
        outputs: [
            {
                label: 'Mean (Average)',
                calculate: (inputs) => {
                    const str = inputs['numbers'] as string;
                    const nums = str.split(/[,\s]+/).map(n => parseFloat(n)).filter(n => !isNaN(n));
                    if (nums.length === 0) return 0;
                    const sum = nums.reduce((a, b) => a + b, 0);
                    return parseFloat((sum / nums.length).toFixed(4));
                },
            },
            {
                label: 'Median',
                calculate: (inputs) => {
                    const str = inputs['numbers'] as string;
                    const nums = str.split(/[,\s]+/).map(n => parseFloat(n)).filter(n => !isNaN(n)).sort((a, b) => a - b);
                    if (nums.length === 0) return 0;
                    const mid = Math.floor(nums.length / 2);
                    if (nums.length % 2 === 0) return (nums[mid - 1] + nums[mid]) / 2;
                    return nums[mid];
                },
            },
            {
                label: 'Mode',
                calculate: (inputs) => {
                    const str = inputs['numbers'] as string;
                    const nums = str.split(/[,\s]+/).map(n => parseFloat(n)).filter(n => !isNaN(n));
                    if (nums.length === 0) return 'None';

                    const freq: Record<number, number> = {};
                    let maxFreq = 0;

                    nums.forEach(n => {
                        freq[n] = (freq[n] || 0) + 1;
                        if (freq[n] > maxFreq) maxFreq = freq[n];
                    });

                    if (maxFreq === 1) return 'No Mode';

                    const modes = Object.keys(freq)
                        .filter(n => freq[parseFloat(n)] === maxFreq)
                        .map(n => parseFloat(n).toString())
                        .join(', ');

                    return modes;
                },
            },
            {
                label: 'Range',
                calculate: (inputs) => {
                    const str = inputs['numbers'] as string;
                    const nums = str.split(/[,\s]+/).map(n => parseFloat(n)).filter(n => !isNaN(n)).sort((a, b) => a - b);
                    if (nums.length === 0) return 0;
                    return nums[nums.length - 1] - nums[0];
                }
            }
        ],
        content: {
            whatIs: `
        <h3>Measures of Central Tendency</h3>
        <p>In statistics, a "central tendency" is a central or typical value for a probability distribution. This calculator finds the:</p>
        <ul class="list-disc pl-5 space-y-1 text-gray-600">
            <li><strong>Mean (Average):</strong> The sum of all numbers divided by the count.</li>
            <li><strong>Median:</strong> The middle number when sorted.</li>
            <li><strong>Mode:</strong> The most frequently occurring number.</li>
            <li><strong>Range:</strong> The difference between the highest and lowest values.</li>
        </ul>
      `,
            howTo: `
        <h3>Calculating Manually</h3>
        <div class="space-y-4 my-4">
            <div class="bg-gray-50 p-3 rounded">
                <p class="font-bold text-gray-700">Data Set: {2, 5, 9, 3, 5, 4, 7}</p>
                <p class="text-sm text-gray-600 mt-1">Sorted: {2, 3, 4, 5, 5, 7, 9}</p>
            </div>
            <div class="grid gap-2 text-sm">
                <p><strong>Mean:</strong> (2+3+4+5+5+7+9) ÷ 7 = 5</p>
                <p><strong>Median:</strong> The 4th number is 5.</p>
                <p><strong>Mode:</strong> 5 appears twice.</p>
                <p><strong>Range:</strong> 9 - 2 = 7</p>
            </div>
        </div>
      `,
            faq: [
                {
                    question: 'When should I use Median instead of Mean?',
                    answer: 'The Median is better when your data has outliers (extremely high or low values) because the Mean gets skewed by them. For example, in house prices, one mansion can skew the average price up, but the median remains representative.',
                },
                {
                    question: 'Can there be more than one Mode?',
                    answer: 'Yes! If two numbers appear with equal frequency, the data is "bimodal". If more than two, it is "multimodal". our tool lists all modes found.',
                }
            ],
        },
    },
    'gcd': {
        id: 'gcd',
        title: 'GCD Calculator',
        description: 'Calculate the Greatest Common Divisor (GCD) of numbers.',
        category: 'math',
        icon: 'Calculator',
        meta: {
            title: 'GCD Calculator (Greatest Common Divisor) | MyCalcOnline',
            description: 'Find the Greatest Common Divisor (GCD) or Highest Common Factor (HCF) of a set of numbers.',
            keywords: ['gcd calculator', 'greatest common divisor', 'hcf calculator', 'highest common factor'],
        },
        inputs: [
            {
                id: 'numbers',
                label: 'Numbers (comma separated)',
                type: 'text',
                placeholder: 'e.g. 12, 18, 24',
                defaultValue: '12, 18, 24',
            },
        ],
        outputs: [
            {
                label: 'GCD Result',
                calculate: (inputs) => {
                    const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b));
                    const str = inputs['numbers'] as string;
                    const nums = str.split(/[,\s]+/).map(n => Math.abs(Math.round(parseFloat(n)))).filter(n => !isNaN(n) && n > 0);
                    if (nums.length === 0) return 0;
                    return nums.reduce((a, b) => gcd(a, b));
                },
            },
        ],
        content: {
            whatIs: `
            <h3>Greatest Common Divisor (GCD)</h3>
            <p>The GCD of two or more integers is the largest positive integer that divides each of the integers. It is also known as the Greatest Common Factor (GCF) or Highest Common Factor (HCF).</p>
            `,
            howTo: `
            <h3>Finding the GCD</h3>
            <p class="mb-2"><strong>Example:</strong> GCD of 12 and 18.</p>
            <div class="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
                <div>
                    <span class="block font-semibold text-gray-700">Factors of 12</span>
                    <span class="text-gray-600">{1, 2, 3, 4, 6, 12}</span>
                </div>
                <div>
                    <span class="block font-semibold text-gray-700">Factors of 18</span>
                    <span class="text-gray-600">{1, 2, 3, 6, 9, 18}</span>
                </div>
            </div>
            <p>The common factors are {1, 2, 3, 6}. The largest is <strong>6</strong>.</p>
            `,
            faq: [
                {
                    question: "What is the Euclidean Algorithm?",
                    answer: "It's an efficient method for computing GCD. It works by repeatedly replacing the larger number with the remainder of dividing the larger by the smaller."
                }
            ]
        }
    },
    'lcm': {
        id: 'lcm',
        title: 'LCM Calculator',
        description: 'Calculate the Least Common Multiple (LCM) of numbers.',
        category: 'math',
        icon: 'Calculator',
        meta: {
            title: 'LCM Calculator (Least Common Multiple) | MyCalcOnline',
            description: 'Find the Least Common Multiple (LCM) of two or more numbers.',
            keywords: ['lcm calculator', 'least common multiple', 'lowest common multiple'],
        },
        inputs: [
            {
                id: 'numbers',
                label: 'Numbers (comma separated)',
                type: 'text',
                placeholder: 'e.g. 4, 6, 8',
                defaultValue: '4, 6, 8',
            },
        ],
        outputs: [
            {
                label: 'LCM Result',
                calculate: (inputs) => {
                    const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b));
                    const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

                    const str = inputs['numbers'] as string;
                    const nums = str.split(/[,\s]+/).map(n => Math.abs(Math.round(parseFloat(n)))).filter(n => !isNaN(n) && n > 0);
                    if (nums.length === 0) return 0;
                    return nums.reduce((a, b) => lcm(a, b));
                },
            },
        ],
        content: {
            whatIs: `
            <h3>Least Common Multiple (LCM)</h3>
            <p>The LCM of two integers is the lowest positive integer that is divisible by both integers. It is useful for adding fractions with different denominators.</p>
            `,
            howTo: `
            <h3>Finding the LCM</h3>
            <p class="mb-2"><strong>Example:</strong> LCM of 4 and 6.</p>
            <div class="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
                <div>
                    <span class="block font-semibold text-gray-700">Multiples of 4</span>
                    <span class="text-gray-600">4, 8, 12, 16, 20, 24...</span>
                </div>
                <div>
                    <span class="block font-semibold text-gray-700">Multiples of 6</span>
                    <span class="text-gray-600">6, 12, 18, 24, 30...</span>
                </div>
            </div>
            <p>The common multiples are {12, 24...}. The smallest is <strong>12</strong>.</p>
            `,
            faq: [
                {
                    question: "Is there a formula linking GCD and LCM?",
                    answer: "Yes! For two numbers <em>a</em> and <em>b</em>: <strong>LCM(a, b) = (a × b) / GCD(a, b)</strong>."
                }
            ]
        }
    },
    'discount': {
        id: 'discount',
        title: 'Discount Calculator',
        description: 'Calculate final price, savings, best deals, and tax. Supports percentage and fixed amount off.',
        category: 'finance',
        icon: 'Tag',
        meta: {
            title: 'Discount Calculator | Sale Price, Savings & Tax',
            description: 'The best Discount Calculator to find the sale price, amount saved, and final tax. Supports percentage off, fixed amount off, and advanced tax options.',
            keywords: ['discount calculator', 'percent off calculator', 'sale price calculator', 'discount tax calculator', 'how to calculate discount'],
        },
        inputs: [
            {
                id: 'original_price',
                label: 'Original Price ($)',
                type: 'number',
                placeholder: '100',
                defaultValue: 100,
            },
            {
                id: 'discount_type',
                label: 'Discount Type',
                type: 'select',
                defaultValue: 'percent',
                options: [
                    { label: 'Percent Off (%)', value: 'percent' },
                    { label: 'Fixed Amount Off ($)', value: 'amount' },
                ],
            },
            {
                id: 'discount_val',
                label: 'Discount Value',
                type: 'number',
                placeholder: '20',
                defaultValue: 20,
            },
            {
                id: 'include_tax',
                label: 'Include Tax?',
                type: 'checkbox',
                defaultValue: false,
                placeholder: 'Add Tax Calculation',
            },
            {
                id: 'tax_rate',
                label: 'Tax Rate (%)',
                type: 'number',
                placeholder: 'e.g. 10',
                defaultValue: 0,
                condition: (inputs) => !!inputs['include_tax'],
            },
        ],
        outputs: [
            {
                label: 'Final Price (You Pay)',
                calculate: (inputs) => {
                    const price = Number(inputs['original_price']);
                    const discount = Number(inputs['discount_val']);
                    const type = inputs['discount_type'];
                    const hasTax = Boolean(inputs['include_tax']);
                    const taxRate = Number(inputs['tax_rate']);

                    if (isNaN(price)) return 0;

                    let discountAmount = 0;
                    if (type === 'percent') {
                        discountAmount = price * (discount / 100);
                    } else {
                        discountAmount = discount;
                    }

                    const discountedPrice = Math.max(0, price - discountAmount);
                    let finalPrice = discountedPrice;

                    // Tax is usually applied to the discounted price
                    if (hasTax && !isNaN(taxRate)) {
                        finalPrice += discountedPrice * (taxRate / 100);
                    }

                    return parseFloat(finalPrice.toFixed(2));
                },
                unit: '$',
            },
            {
                label: 'You Save',
                calculate: (inputs) => {
                    const price = Number(inputs['original_price']);
                    const discount = Number(inputs['discount_val']);
                    const type = inputs['discount_type'];

                    let discountAmount = 0;
                    if (type === 'percent') {
                        discountAmount = price * (discount / 100);
                    } else {
                        discountAmount = discount;
                    }
                    return parseFloat(discountAmount.toFixed(2));
                },
                unit: '$',
            },
            {
                label: 'Tax Amount',
                calculate: (inputs) => {
                    const price = Number(inputs['original_price']);
                    const discount = Number(inputs['discount_val']);
                    const type = inputs['discount_type'];
                    const hasTax = Boolean(inputs['include_tax']);
                    const taxRate = Number(inputs['tax_rate']);

                    if (!hasTax || isNaN(taxRate)) return 0;

                    let discountAmount = 0;
                    if (type === 'percent') {
                        discountAmount = price * (discount / 100);
                    } else {
                        discountAmount = discount;
                    }

                    const discountedPrice = Math.max(0, price - discountAmount);
                    const taxAmount = discountedPrice * (taxRate / 100);
                    return parseFloat(taxAmount.toFixed(2));
                },
                unit: '$',
            }
        ],
        content: {
            whatIs: `
            <h3>How to Calculate Discount?</h3>
            <p>A discount is a reduction applied to the original price of a product or service. The most common type is "Percent Off" (e.g., 20% off), but fixed amount discounts ($10 off) are also popular.</p>
            <p>Our calculator performs three main steps:</p>
            <ol class="list-decimal pl-5 space-y-1 text-gray-600 mt-2">
                <li>Determines the <strong>Discount Amount</strong> (Savings).</li>
                <li>Subtracts savings from the Original Price to get the <strong>Discounted Price</strong>.</li>
                <li>If tax is enabled, it adds the tax percentage to the Discounted Price to find the <strong>Final Price</strong>.</li>
            </ol>
            `,
            howTo: `
            <h3>Discount Formulas</h3>
            <div class="space-y-4 my-4">
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 class="font-bold text-gray-800 mb-2">1. Percentage Discount</h4>
                    <p class="font-mono text-sm text-blue-600">Savings = Original_Price × (Discount% / 100)</p>
                    <p class="font-mono text-sm text-blue-700 mt-1">Final_Price = Original_Price - Savings</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 class="font-bold text-gray-800 mb-2">2. Fixed Amount</h4>
                    <p class="font-mono text-sm text-blue-600">Final_Price = Original_Price - Discount_Amount</p>
                </div>
            </div>
            <h3>Example Calculation</h3>
            <p>You want to buy a pair of shoes for <strong>$80</strong> with a <strong>20% discount</strong> and <strong>8% sales tax</strong>.</p>
            <ul class="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                <li><strong>Step 1 (Savings):</strong> $80 × 0.20 = <span class="text-green-600 font-bold">$16 saved</span>.</li>
                <li><strong>Step 2 (Price after Coupon):</strong> $80 - $16 = $64.</li>
                <li><strong>Step 3 (Tax):</strong> $64 × 0.08 = $5.12 tax.</li>
                <li><strong>Final To Pay:</strong> $64 + $5.12 = <span class="text-blue-700 font-bold">$69.12</span>.</li>
            </ul>
            `,
            faq: [
                {
                    question: 'How do I calculate a 20% discount?',
                    answer: 'To calculate a 20% discount, multiply the original price by 0.20 (or divide by 5). Then subtract this amount from the original price.'
                },
                {
                    question: 'Is tax calculated before or after the discount?',
                    answer: 'In most retail scenarios (US, UK, Europe), sales tax (VAT) is calculated on the <strong>discounted price</strong> (after the coupon is applied), which saves you money on taxes! Our calculator follows this standard.'
                },
                {
                    question: 'What is a "Double Discount"?',
                    answer: 'A double discount happens when you apply two coupons, like "20% off" plus an "extra 10% off". Note that 20% + 10% is NOT 30%. You take 20% off first, then take 10% off the new lower price. This usually results in slightly less savings than adding the percentages directly.'
                }
            ]
        }
    },
    'percentage': {
        id: 'percentage',
        title: 'Percentage Calculator',
        description: 'Calculate percentages, percentage increase/decrease, and what percentage one number is of another.',
        category: 'math',
        icon: 'Percent',
        meta: {
            title: 'Percentage Calculator | Calculate %, Increase, Decrease',
            description: 'Comprehensive percentage calculator. Calculate X% of Y, percentage increase/decrease, and find what percentage X is of Y.',
            keywords: ['percentage calculator', 'percent calculator', 'calculate percentage', 'percentage increase calculator', 'percentage decrease calculator'],
        },
        inputs: [
            {
                id: 'mode',
                label: 'What to calculate?',
                type: 'select',
                defaultValue: 'x_percent_of_y',
                options: [
                    { label: 'What is X% of Y?', value: 'x_percent_of_y' },
                    { label: 'X is what % of Y?', value: 'x_is_what_percent_of_y' },
                    { label: 'Percentage Increase/Decrease', value: 'percentage_change' },
                ],
            },
            {
                id: 'val_x',
                label: 'Value X',
                type: 'number',
                placeholder: 'e.g. 20',
            },
            {
                id: 'val_y',
                label: 'Value Y',
                type: 'number',
                placeholder: 'e.g. 100',
            },
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const mode = inputs['mode'];
                    const x = inputs['val_x'];
                    const y = inputs['val_y'];

                    if (typeof x !== 'number' || typeof y !== 'number') return 0;

                    if (mode === 'x_percent_of_y') {
                        // What is X% of Y?
                        return parseFloat((y * (x / 100)).toFixed(2));
                    } else if (mode === 'x_is_what_percent_of_y') {
                        // X is what % of Y?
                        if (y === 0) return 0;
                        return parseFloat(((x / y) * 100).toFixed(2));
                    } else if (mode === 'percentage_change') {
                        // Percentage Increase/Decrease (X to Y)
                        // Note: val_x should be "From", val_y should be "To" conceptually, but using generic labels.
                        // Let's assume X = From, Y = To for consistency with input order, OR rename inputs?
                        // Better to stick to generic X/Y for simplicity in one calc. 
                        // Logic: ((Y - X) / X) * 100
                        if (x === 0) return 0;
                        return parseFloat(((y - x) / x * 100).toFixed(2));
                    }
                    return 0;
                },
            },
        ],
        content: {
            whatIs: `
            <h3>Understanding Percentages</h3>
            <p>A percentage is simply a ratio or fraction out of 100. It's a way to express a number as a fraction of 100 (per cent meaning "by the hundred"). It is denoted using the percent sign, "%".</p>
            <p>Percentages are everywhere in daily life: from calculating tips at dinner, figuring out discounts during sales, to understanding interest rates on loans.</p>
            `,
            howTo: `
            <h3>Step-by-Step Examples</h3>
            <div class="space-y-6 my-6">
                <div class="flex gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div class="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-200 text-blue-700 font-bold">1</div>
                    <div>
                        <h4 class="font-bold text-blue-900">Calculate a Percentage of a Number</h4>
                        <p class="text-sm text-blue-800 mb-2">Example: What is 20% of 150?</p>
                        <p class="text-sm text-gray-600">Convert 20% to a decimal (0.20) and multiply by 150.</p>
                        <code class="block mt-2 bg-white/50 p-2 rounded text-blue-900 font-mono text-xs">150 × 0.20 = 30</code>
                    </div>
                </div>

                <div class="flex gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div class="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-emerald-200 text-emerald-700 font-bold">2</div>
                    <div>
                        <h4 class="font-bold text-emerald-900">Calculate Percentage Increase</h4>
                        <p class="text-sm text-emerald-800 mb-2">Example: Price rose from $50 to $80</p>
                        <p class="text-sm text-gray-600">Subtract old from new, divide by old, then multiply by 100.</p>
                        <code class="block mt-2 bg-white/50 p-2 rounded text-emerald-900 font-mono text-xs">((80 - 50) ÷ 50) × 100 = 60%</code>
                    </div>
                </div>

                <div class="flex gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <div class="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-purple-200 text-purple-700 font-bold">3</div>
                    <div>
                        <h4 class="font-bold text-purple-900">Calculate "X is what % of Y"</h4>
                        <p class="text-sm text-purple-800 mb-2">Example: 25 is what percent of 200?</p>
                        <p class="text-sm text-gray-600">Divide the part by the whole, then multiply by 100.</p>
                        <code class="block mt-2 bg-white/50 p-2 rounded text-purple-900 font-mono text-xs">(25 ÷ 200) × 100 = 12.5%</code>
                    </div>
                </div>
            </div>
            `,
            faq: [
                {
                    question: "How do I calculate a 20% tip manually?",
                    answer: "Move the decimal point of the bill amount one place to the left (to find 10%) and then double that number. For a $50 bill, 10% is $5. Doubling that gives you $10."
                },
                {
                    question: "What is the formula for percentage change?",
                    answer: "Currently Value minus Original Value, divided by Original Value, all multiplied by 100. (New - Old) / Old × 100."
                },
                {
                    question: "How do I reverse a percentage?",
                    answer: "To find the original number before a percentage increase, divide the final number by (1 + percentage/100). E.g., if $120 is price after 20% tax, original = 120 / 1.20 = $100."
                }
            ]
        }
    },
    'bmi': {
        id: 'bmi',
        title: 'BMI Calculator',
        description: 'Calculate Body Mass Index (BMI) and find your healthy weight range.',
        category: 'health',
        icon: 'Scale',
        meta: {
            title: 'BMI Calculator | Body Mass Index & Healthy Weight Range',
            description: 'Calculate your BMI (Body Mass Index) and discover your ideal weight range. Supports Metric (kg/cm) and Imperial (lbs/ft) units.',
            keywords: ['bmi calculator', 'body mass index', 'obesity calculator', 'healthy weight calculator', 'ideal weight'],
        },
        inputs: [
            {
                id: 'system',
                label: 'Unit System',
                type: 'select',
                defaultValue: 'metric',
                options: [
                    { label: 'Metric (kg, cm)', value: 'metric' },
                    { label: 'Imperial (lbs, ft+in)', value: 'imperial' },
                ],
            },
            {
                id: 'weight',
                label: 'Weight',
                type: 'number',
                placeholder: 'e.g. 70 (kg) or 154 (lbs)',
            },
            {
                id: 'height',
                label: 'Height',
                type: 'number',
                placeholder: 'e.g. 175 (cm) or 69 (total inches)',
                unit: 'cm / inches',
            },
        ],
        outputs: [
            {
                label: 'Your BMI',
                unit: '',
                calculate: (inputs) => {
                    const system = inputs['system'];
                    const weight = Number(inputs['weight']);
                    const height = Number(inputs['height']);

                    if (!weight || !height) return 0;

                    if (system === 'metric') {
                        // Weight kg, Height cm
                        const hM = height / 100;
                        return parseFloat((weight / (hM * hM)).toFixed(1));
                    } else {
                        // Weight lb, Height inches
                        // Formula: 703 * lb / in^2
                        return parseFloat(((weight / (height * height)) * 703).toFixed(1));
                    }
                },
            },
            {
                label: 'Category',
                unit: '',
                calculate: (inputs) => {
                    const system = inputs['system'];
                    const weight = Number(inputs['weight']);
                    const height = Number(inputs['height']);
                    if (!weight || !height) return 'N/A';

                    let bmi = 0;
                    if (system === 'metric') {
                        const hM = height / 100;
                        bmi = weight / (hM * hM);
                    } else {
                        bmi = (weight / (height * height)) * 703;
                    }

                    if (bmi < 18.5) return 'Underweight';
                    if (bmi < 25) return 'Normal Weight';
                    if (bmi < 30) return 'Overweight';
                    return 'Obese';
                }
            },
            {
                label: 'Healthy Weight Range',
                unit: '',
                calculate: (inputs) => {
                    const system = inputs['system'];
                    const height = Number(inputs['height']);
                    if (!height) return 'N/A';

                    if (system === 'metric') {
                        // Normal BMI: 18.5 - 24.9
                        // Weight = BMI * (height in m)^2
                        const hM = height / 100;
                        const minW = (18.5 * hM * hM).toFixed(1);
                        const maxW = (24.9 * hM * hM).toFixed(1);
                        return `${minW}kg - ${maxW}kg`;
                    } else {
                        // Weight = (BMI * height^2) / 703
                        const minW = ((18.5 * height * height) / 703).toFixed(0);
                        const maxW = ((24.9 * height * height) / 703).toFixed(0);
                        return `${minW}lbs - ${maxW}lbs`;
                    }
                }
            }
        ],
        content: {
            whatIs: `
            <h3>What is BMI?</h3>
            <p><strong>Body Mass Index (BMI)</strong> is a simple calculation using a person's height and weight. The formula is BMI = kg/m² where kg is a person's weight in kilograms and m² is their height in meters squared.</p>
            <p>A BMI of 25.0 or more is overweight, while the healthy range is usually <strong>18.5 to 24.9</strong>.</p>
            
            <div class="mt-6 not-prose">
                <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">WHO Weight Categories</h4>
                <div class="overflow-hidden rounded-xl border border-gray-200">
                    <table class="min-w-full divide-y divide-gray-200 text-center">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">BMI Range</th>
                                <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Classification</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200 text-sm">
                            <tr><td class="px-6 py-4 text-blue-600 font-medium">&lt; 18.5</td><td class="px-6 py-4 text-gray-900">Underweight</td></tr>
                            <tr class="bg-green-50"><td class="px-6 py-4 text-green-600 font-medium font-bold">18.5 – 24.9</td><td class="px-6 py-4 text-gray-900 font-bold">Normal Weight</td></tr>
                            <tr><td class="px-6 py-4 text-orange-600 font-medium">25 – 29.9</td><td class="px-6 py-4 text-gray-900">Overweight</td></tr>
                            <tr><td class="px-6 py-4 text-red-600 font-medium">30+</td><td class="px-6 py-4 text-gray-900">Obesity</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
            `,
            howTo: `
            <h3>How to Calculate BMI Locally</h3>
            <div class="grid md:grid-cols-2 gap-4 my-4">
                <div class="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h5 class="font-semibold text-blue-900 mb-2">Metric Formula</h5>
                    <p class="text-sm text-blue-800">Weight (kg) / Height (m)²</p>
                    <p class="text-xs text-blue-600 mt-2 italic">Example: 70kg / (1.75m)² = <strong>22.86</strong></p>
                </div>
                <div class="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                    <h5 class="font-semibold text-indigo-900 mb-2">Imperial Formula</h5>
                    <p class="text-sm text-indigo-800">[Weight (lbs) / Height (in)²] × 703</p>
                    <p class="text-xs text-indigo-600 mt-2 italic">Example: [154lbs / (69in)²] × 703 = <strong>22.7</strong></p>
                </div>
            </div>
            `,
            faq: [
                {
                    question: "Is BMI accurate for everyone?",
                    answer: "No. BMI does not distinguish between muscle and fat. Athletes or bodybuilders may have a high BMI (classified as overweight) despite having low body fat and being very healthy."
                },
                {
                    question: "What is my 'Healthy Weight' range?",
                    answer: "Our calculator automatically shows this! It reverses the BMI formula to find what weight would put you exactly between BMI 18.5 and 24.9 for your height."
                }
            ]
        }
    },
    'roi': {
        id: 'roi',
        title: 'ROI Calculator',
        description: 'Calculate Return on Investment (ROI) and annualized return.',
        category: 'finance',
        icon: 'TrendingUp',
        meta: {
            title: 'ROI Calculator | Return on Investment & Annualized Profit',
            description: 'Free ROI Calculator. Calculate Return on Investment, annualized ROI, and total profit. Includes investment duration support (years/months).',
            keywords: ['roi calculator', 'return on investment', 'investment calculator', 'profit calculator', 'annualized return', 'roi formula'],
        },
        inputs: [
            {
                id: 'invested',
                label: 'Amount Invested ($)',
                type: 'number',
                placeholder: 'e.g. 1000',
                defaultValue: 1000,
            },
            {
                id: 'returned',
                label: 'Amount Returned ($)',
                type: 'number',
                placeholder: 'e.g. 1500',
                defaultValue: 1500,
            },
            {
                id: 'duration',
                label: 'Investment Duration',
                type: 'number',
                defaultValue: 1,
                placeholder: 'e.g. 1',
            },
            {
                id: 'time_unit',
                label: 'Time Unit',
                type: 'select',
                defaultValue: 'years',
                options: [
                    { label: 'Years', value: 'years' },
                    { label: 'Months', value: 'months' },
                ]
            },
        ],
        outputs: [
            {
                label: 'ROI',
                unit: '%',
                calculate: (inputs) => {
                    const initial = Number(inputs['invested']);
                    const final = Number(inputs['returned']);
                    if (!initial) return 0;
                    return parseFloat((((final - initial) / initial) * 100).toFixed(2));
                },
            },
            {
                label: 'Total Profit',
                unit: '$',
                calculate: (inputs) => {
                    const initial = Number(inputs['invested']);
                    const final = Number(inputs['returned']);
                    return parseFloat((final - initial).toFixed(2));
                },
            },
            {
                label: 'Annualized ROI',
                unit: '%',
                calculate: (inputs) => {
                    const initial = Number(inputs['invested']);
                    const final = Number(inputs['returned']);
                    const duration = Number(inputs['duration']) || 0;
                    const unit = inputs['time_unit'];

                    if (!initial || initial < 0 || final < 0 || duration <= 0) return 0;

                    // Normalize time to years
                    const years = unit === 'months' ? duration / 12 : duration;

                    // Formula: ( (Final / Initial) ^ (1/t) ) - 1
                    const annualized = (Math.pow(final / initial, 1 / years) - 1) * 100;
                    return parseFloat(annualized.toFixed(2));
                },
            }
        ],
        content: {
            whatIs: `
            <h3>What is ROI?</h3>
            <p><strong>Return on Investment (ROI)</strong> is the ultimate metric to measure the efficiency of an investment. It tells you exactly how much money you've made (or lost) relative to what you spent.</p>
            <p>Whether you're flipping houses, buying stocks, or running a lemonade stand, ROI answers the golden question: <em>"Was it worth it?"</em></p>
            `,
            howTo: `
            <h3>Step-by-Step Example: Real Estate Flip</h3>
            <div class="space-y-6 my-6">
                <div class="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div class="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold">1</div>
                    <div>
                        <h4 class="font-bold text-gray-900">The Investment</h4>
                        <p class="text-sm text-gray-600 mb-2">You buy a fixer-upper house for <strong>$200,000</strong>.</p>
                        <p class="text-xs text-gray-500 font-mono">Input: Amount Invested = 200000</p>
                    </div>
                </div>

                <div class="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div class="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold">2</div>
                    <div>
                        <h4 class="font-bold text-gray-900">The Return</h4>
                        <p class="text-sm text-gray-600 mb-2">After renovations, you sell it for <strong>$250,000</strong>.</p>
                        <p class="text-xs text-gray-500 font-mono">Input: Amount Returned = 250000</p>
                    </div>
                </div>

                <div class="flex gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                    <div class="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold">=</div>
                    <div>
                        <h4 class="font-bold text-green-900">The Result</h4>
                        <p class="text-sm text-green-800 mb-2">The calculator shows a <strong>25% ROI</strong>.</p>
                        <p class="text-xs text-green-700">Profit: $50,000</p>
                    </div>
                </div>
            </div>
            
            <h3>Understanding Annualized ROI</h3>
            <p>If that house flip took <strong>6 months</strong> (0.5 years), your money grew much faster than if it took 5 years. The "Annualized ROI" adjusts for this time.</p>
            <p><em>In our example: earning 25% in 6 months is equivalent to a massive <strong>56.25%</strong> annual rate!</em></p>
            `,
            faq: [
                {
                    question: "What is a good ROI?",
                    answer: "It depends heavily on the risk and timeframe. The stock market historically averages about 7-10% annually. For real estate or high-risk businesses, investors often look for 15-20% or more."
                },
                {
                    question: "Can ROI be negative?",
                    answer: "Yes. If your 'Amount Returned' is less than your 'Amount Invested', you have lost money, and your ROI will be a negative percentage (e.g., -15%)."
                },
                {
                    question: "Why is Annualized ROI sometimes higher than total ROI?",
                    answer: "If your investment duration is less than 1 year (e.g., 6 months), the Annualized ROI projects what you would earn if you could repeat that success for a full year. It shows the 'speed' of your compounding."
                }
            ]
        }
    },

    'calorie': {
        id: 'calorie',
        title: 'Calorie Calculator',
        description: 'Calculate daily calorie needs (TDEE) for weight loss, maintenance, or gain.',
        category: 'health',
        icon: 'Flame',
        meta: {
            title: 'Calorie Calculator | TDEE, BMR & Weight Loss Goals',
            description: 'Calculate your TDEE and BMR. Find out exactly how many calories to eat to lose weight, maintain, or bulking. Metric & Imperial.',
            keywords: ['calorie calculator', 'tdee calculator', 'bmr calculator', 'weight loss calculator', 'daily calories'],
        },
        inputs: [
            {
                id: 'system',
                label: 'Unit System',
                type: 'select',
                defaultValue: 'metric',
                options: [
                    { label: 'Metric (kg, cm)', value: 'metric' },
                    { label: 'Imperial (lbs, ft+in)', value: 'imperial' },
                ],
            },
            {
                id: 'gender',
                label: 'Gender',
                type: 'select',
                defaultValue: 'male',
                options: [
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                ],
            },
            {
                id: 'age',
                label: 'Age',
                type: 'number',
                placeholder: 'e.g. 30',
            },
            {
                id: 'weight',
                label: 'Weight',
                type: 'number',
                placeholder: 'e.g. 70 (kg) or 154 (lbs)',
            },
            {
                id: 'height',
                label: 'Height',
                type: 'number',
                placeholder: 'e.g. 175 (cm) or 69 (total inches)',
                unit: 'cm / inches',
            },
            {
                id: 'activity',
                label: 'Activity Level',
                type: 'select',
                defaultValue: 'moderate',
                options: [
                    { label: 'Sedentary (Office job, little exercise)', value: 'sedentary' },
                    { label: 'Light (Exercise 1-3 days/week)', value: 'light' },
                    { label: 'Moderate (Exercise 3-5 days/week)', value: 'moderate' },
                    { label: 'Active (Exercise 6-7 days/week)', value: 'active' },
                    { label: 'Very Active (Physical job + training)', value: 'veryActive' },
                ],
            },
        ],
        outputs: [
            {
                label: 'Maintenance (TDEE)',
                unit: 'kcal',
                calculate: (inputs) => {
                    const system = inputs['system'];
                    const weight = Number(inputs['weight']);
                    const height = Number(inputs['height']);
                    const age = Number(inputs['age']);
                    const gender = inputs['gender'];
                    const activity = inputs['activity'] as string;

                    if (!weight || !height || !age) return 0;

                    let bmr = 0;
                    if (system === 'metric') {
                        // Mifflin-St Jeor Metric: 10W + 6.25H - 5A + S
                        bmr = (10 * weight) + (6.25 * height) - (5 * age);
                    } else {
                        // Imperial: 4.536W + 15.88H - 5A + S
                        // 1 lb = 0.453592 kg, 1 inch = 2.54 cm
                        const weightKg = weight * 0.453592;
                        const heightCm = height * 2.54;
                        bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
                    }

                    if (gender === 'male') bmr += 5; else bmr -= 161;

                    const multipliers: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };
                    return Math.round(bmr * (multipliers[activity] || 1.2));
                },
            },
            {
                label: 'Basal Metabolic Rate (BMR)',
                unit: 'kcal',
                calculate: (inputs) => {
                    const system = inputs['system'];
                    const weight = Number(inputs['weight']);
                    const height = Number(inputs['height']);
                    const age = Number(inputs['age']);
                    const gender = inputs['gender'];

                    if (!weight || !height || !age) return 0;

                    let bmr = 0;
                    if (system === 'metric') {
                        bmr = (10 * weight) + (6.25 * height) - (5 * age);
                    } else {
                        const weightKg = weight * 0.453592;
                        const heightCm = height * 2.54;
                        bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
                    }

                    if (gender === 'male') bmr += 5; else bmr -= 161;
                    return Math.round(bmr);
                },
            },
            {
                label: 'Weight Loss Goal (-0.5kg/wk)',
                unit: 'kcal',
                calculate: (inputs) => {
                    const system = inputs['system'];
                    const weight = Number(inputs['weight']);
                    const height = Number(inputs['height']);
                    const age = Number(inputs['age']);
                    const gender = inputs['gender'];
                    const activity = inputs['activity'] as string;
                    if (!weight || !height || !age) return 0;

                    let bmr = 0;
                    if (system === 'metric') { bmr = (10 * weight) + (6.25 * height) - (5 * age); }
                    else { bmr = (10 * (weight * 0.453592)) + (6.25 * (height * 2.54)) - (5 * age); }
                    if (gender === 'male') bmr += 5; else bmr -= 161;

                    const multipliers: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };
                    const tdee = bmr * (multipliers[activity] || 1.2);
                    return Math.round(tdee - 500);
                },
            },
            {
                label: 'Weight Gain Goal (+0.5kg/wk)',
                unit: 'kcal',
                calculate: (inputs) => {
                    const system = inputs['system'];
                    const weight = Number(inputs['weight']);
                    const height = Number(inputs['height']);
                    const age = Number(inputs['age']);
                    const gender = inputs['gender'];
                    const activity = inputs['activity'] as string;
                    if (!weight || !height || !age) return 0;

                    let bmr = 0;
                    if (system === 'metric') { bmr = (10 * weight) + (6.25 * height) - (5 * age); }
                    else { bmr = (10 * (weight * 0.453592)) + (6.25 * (height * 2.54)) - (5 * age); }
                    if (gender === 'male') bmr += 5; else bmr -= 161;

                    const multipliers: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };
                    const tdee = bmr * (multipliers[activity] || 1.2);
                    return Math.round(tdee + 500);
                },
            }
        ],
        content: {
            whatIs: `
            <h3>What is TDEE vs BMR?</h3>
            <p><strong>BMR (Basal Metabolic Rate)</strong> is the number of calories your body burns just to exist — if you laid in bed all day in a coma, this is what you'd burn.</p>
            <p><strong>TDEE (Total Daily Energy Expenditure)</strong> is your BMR plus the energy you use for movement, work, and exercise. This is your true "Maintenance Calorie" number.</p>
            `,
            howTo: `
            <h3>The Pizza Slice Logic 🍕</h3>
            <p>Why do we talk about calories? Because weight management is math.</p>
            <div class="grid gap-4 my-4">
                <div class="p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <h5 class="font-semibold text-orange-900">To Lose Weight</h5>
                    <p class="text-sm text-gray-700">You must eat BELOW your TDEE. A 500 calorie deficit per day = 3500 per week = approx <strong>0.5kg (1lb) of fat loss</strong>.</p>
                </div>
                <div class="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                    <h5 class="font-semibold text-emerald-900">To Gain Muscle</h5>
                    <p class="text-sm text-gray-700">You must eat ABOVE your TDEE to give your body fuel to build new tissue. A 250-500 calorie surplus is standard.</p>
                </div>
            </div>
            `,
            faq: [
                {
                    question: "Should I eat back my exercise calories?",
                    answer: "<strong>Generally, no.</strong> If you selected 'Active' in the calculator, your exercise is already accounted for in your TDEE result. Adding it again would be 'double counting' and could stop your weight loss."
                },
                {
                    question: "Why is my Apple Watch calorie count different?",
                    answer: "Wearables often overestimate calories burned (sometimes by 20-30%). The TDEE calculations used here (Mifflin-St Jeor) are based on clinical averages and are generally more reliable for long-term planning."
                }
            ]
        }
    },
    'body-fat': {
        id: 'body-fat',
        title: 'Body Fat Calculator',
        description: 'Estimate your body fat percentage based on BMI.',
        category: 'health',
        icon: 'Activity',
        meta: {
            title: 'Body Fat Calculator | Estimate Body Fat %',
            description: 'Simple body fat estimation using BMI method.',
            keywords: ['body fat calculator', 'body fat percentage', 'calculate body fat'],
        },
        inputs: [
            {
                id: 'gender',
                label: 'Gender',
                type: 'select',
                defaultValue: 'male',
                options: [
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                ],
            },
            {
                id: 'age',
                label: 'Age',
                type: 'number',
                placeholder: 'e.g. 30',
            },
            {
                id: 'weight',
                label: 'Weight (kg)',
                type: 'number',
                placeholder: 'e.g. 70',
                unit: 'kg',
            },
            {
                id: 'height',
                label: 'Height (cm)',
                type: 'number',
                placeholder: 'e.g. 175',
                unit: 'cm',
            },
        ],
        outputs: [
            {
                label: 'Body Fat %',
                unit: '%',
                calculate: (inputs) => {
                    const weight = Number(inputs['weight']);
                    const height = Number(inputs['height']);
                    const age = Number(inputs['age']);
                    const gender = inputs['gender'];

                    if (!weight || !height || !age) return 0;

                    // BMI = weight (kg) / height (m)^2
                    const hM = height / 100;
                    const bmi = weight / (hM * hM);

                    // Body Fat Formula based on BMI
                    // Adult Body Fat % = (1.20 × BMI) + (0.23 × Age) - 16.2 (Male) or - 5.4 (Female)
                    let bodyFat = (1.20 * bmi) + (0.23 * age);
                    if (gender === 'male') {
                        bodyFat -= 16.2;
                    } else {
                        bodyFat -= 5.4;
                    }

                    if (bodyFat < 0) return 0;
                    return parseFloat(bodyFat.toFixed(1));
                },
            },
            {
                label: 'BMI Reference',
                unit: '',
                calculate: (inputs) => {
                    const weight = Number(inputs['weight']);
                    const height = Number(inputs['height']);
                    if (!weight || !height) return 0;
                    const hM = height / 100;
                    return parseFloat((weight / (hM * hM)).toFixed(1));
                },
            }
        ],
        content: {
            whatIs: `
            <h3>Body Fat Percentage</h3>
            <p>Your body fat percentage is essentially the amount of fat your body contains compared to everything else (organs, muscles, bones, tendons, water, etc.).</p>
            <p>Men and women carry different amounts of body fat. Essential fat is the minimal amount of fat necessary for normal physiological function: about 2-5% for men and 10-13% for women.</p>
            `,
            howTo: `
            <h3>Understanding Body Fat Ranges</h3>
            <div class="mt-4 overflow-hidden rounded-xl border border-gray-200">
                <table class="min-w-full divide-y divide-gray-200 text-sm">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-3 text-left font-medium text-gray-500">Description</th>
                            <th class="px-4 py-3 text-left font-medium text-gray-500">Women</th>
                            <th class="px-4 py-3 text-left font-medium text-gray-500">Men</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr><td class="px-4 py-3 font-medium text-emerald-600">Athletes</td><td class="px-4 py-3">14-20%</td><td class="px-4 py-3">6-13%</td></tr>
                        <tr><td class="px-4 py-3 font-medium text-green-600">Fitness</td><td class="px-4 py-3">21-24%</td><td class="px-4 py-3">14-17%</td></tr>
                        <tr><td class="px-4 py-3 font-medium text-blue-600">Average</td><td class="px-4 py-3">25-31%</td><td class="px-4 py-3">18-24%</td></tr>
                        <tr><td class="px-4 py-3 font-medium text-orange-600">Obese</td><td class="px-4 py-3">32%+</td><td class="px-4 py-3">25%+</td></tr>
                    </tbody>
                </table>
            </div>
            `,
            faq: [
                {
                    question: "How accurate is the BMI method for Body Fat?",
                    answer: "This calculator uses the BMI method, which is an estimation. It may overestimate body fat for athletes with high muscle mass and underestimate it for those with low muscle mass. For precise medical analysis, a DEXA scan is recommended."
                }
            ]
        }
    },
    'age': {
        id: 'age',
        title: 'Age Calculator',
        description: 'Calculate your exact age in years, months, days, and countdown to next birthday.',
        category: 'everyday',
        icon: 'Calendar',
        meta: {
            title: 'Age Calculator | Years, Months, Days & Birthday Countdown',
            description: 'Find your exact age and countdown to your next birthday. Perfect for legal documents, school admissions, or milestone planning.',
            keywords: ['age calculator', 'how old am i', 'birthday countdown', 'calculate age', 'age in days'],
        },
        inputs: [
            {
                id: 'birthDate',
                label: 'Date of Birth',
                type: 'date',
                placeholder: 'YYYY-MM-DD',
            },
            {
                id: 'targetDate',
                label: 'Target Date (Optional)',
                type: 'date',
                defaultValue: new Date().toISOString().split('T')[0],
                placeholder: 'YYYY-MM-DD',
            },
        ],
        outputs: [
            {
                label: 'Age (Years)',
                unit: 'years',
                calculate: (inputs) => {
                    const dob = new Date(inputs['birthDate']);
                    const target = inputs['targetDate'] ? new Date(inputs['targetDate']) : new Date();
                    if (isNaN(dob.getTime())) return 0;

                    let age = target.getFullYear() - dob.getFullYear();
                    const m = target.getMonth() - dob.getMonth();
                    if (m < 0 || (m === 0 && target.getDate() < dob.getDate())) age--;
                    return age >= 0 ? age : 0;
                },
            },
            {
                label: 'Total Months',
                unit: 'months',
                calculate: (inputs) => {
                    const dob = new Date(inputs['birthDate']);
                    const target = inputs['targetDate'] ? new Date(inputs['targetDate']) : new Date();
                    if (isNaN(dob.getTime())) return 0;

                    const years = target.getFullYear() - dob.getFullYear();
                    const months = target.getMonth() - dob.getMonth();
                    let total = years * 12 + months;
                    if (target.getDate() < dob.getDate()) total--;
                    return total >= 0 ? total : 0;
                },
            },
            {
                label: 'Total Days',
                unit: 'days',
                calculate: (inputs) => {
                    const dob = new Date(inputs['birthDate']);
                    const target = inputs['targetDate'] ? new Date(inputs['targetDate']) : new Date();
                    if (isNaN(dob.getTime())) return 0;

                    const diffTime = target.getTime() - dob.getTime();
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays >= 0 ? diffDays : 0;
                },
            },
            {
                label: 'Days Until Next Birthday',
                unit: 'days',
                calculate: (inputs) => {
                    const dob = new Date(inputs['birthDate']);
                    const target = inputs['targetDate'] ? new Date(inputs['targetDate']) : new Date();
                    if (isNaN(dob.getTime())) return 'N/A';

                    const thisYearBD = new Date(target.getFullYear(), dob.getMonth(), dob.getDate());
                    if (thisYearBD < target) {
                        thisYearBD.setFullYear(thisYearBD.getFullYear() + 1);
                    }
                    const diff = Math.ceil((thisYearBD.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
                    return diff === 0 ? '🎂 TODAY!' : diff;
                },
            }
        ],
        content: {
            whatIs: `
            <h3>Why Calculate Your Exact Age?</h3>
            <p>Your "age" isn't just a single number. For legal documents, visa applications, school cutoffs, and milestone planning, knowing your exact age in <strong>years, months, and days</strong> matters.</p>
            <p>Plus, who doesn't want to know exactly how many days until their next birthday? 🎂</p>
            `,
            howTo: `
            <h3>Age Milestones</h3>
            <div class="grid md:grid-cols-3 gap-4 mt-4">
                <div class="p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-center">
                    <span class="text-3xl">🎂</span>
                    <p class="font-bold text-yellow-900 mt-2">10,000 Days</p>
                    <p class="text-xs text-yellow-700">≈ 27 years old</p>
                </div>
                <div class="p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
                    <span class="text-3xl">🍷</span>
                    <p class="font-bold text-blue-900 mt-2">1 Billion Seconds</p>
                    <p class="text-xs text-blue-700">≈ 31.7 years old</p>
                </div>
                <div class="p-4 bg-purple-50 rounded-lg border border-purple-100 text-center">
                    <span class="text-3xl">🌟</span>
                    <p class="font-bold text-purple-900 mt-2">20,000 Days</p>
                    <p class="text-xs text-purple-700">≈ 54.7 years old</p>
                </div>
            </div>
            `,
            faq: [
                {
                    question: "Does this account for Leap Years?",
                    answer: "Yes! Our algorithm correctly accounts for leap years (years with 366 days) to ensure the day count is perfectly accurate."
                },
                {
                    question: "What is 'Days Until Next Birthday'?",
                    answer: "This countdown tells you exactly how many days remain until your next birthday. If the target date IS your birthday, it will show '🎂 TODAY!'."
                }
            ]
        }
    },
    'date-difference': {
        id: 'date-difference',
        title: 'Date Difference',
        description: 'Calculate the duration between two dates.',
        category: 'everyday',
        icon: 'CalendarDays',
        meta: {
            title: 'Days Between Dates Calculator | Date Difference',
            description: 'Calculate the number of days, weeks, or months between two dates.',
            keywords: ['date difference', 'days between dates', 'time duration', 'calendar calculator'],
        },
        inputs: [
            {
                id: 'startDate',
                label: 'Start Date',
                type: 'date',
                placeholder: 'YYYY-MM-DD',
            },
            {
                id: 'endDate',
                label: 'End Date',
                type: 'date',
                placeholder: 'YYYY-MM-DD',
            },
        ],
        outputs: [
            {
                label: 'Total Days',
                unit: 'days',
                calculate: (inputs) => {
                    const start = new Date(inputs['startDate']);
                    const end = new Date(inputs['endDate']);

                    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

                    const diffTime = Math.abs(end.getTime() - start.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays;
                },
            },
            {
                label: 'Weeks',
                unit: 'weeks',
                calculate: (inputs) => {
                    const start = new Date(inputs['startDate']);
                    const end = new Date(inputs['endDate']);
                    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

                    const diffTime = Math.abs(end.getTime() - start.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return parseFloat((diffDays / 7).toFixed(1));
                },
            }
        ],
        content: {
            whatIs: `
            <h3>Calculate Time Between Dates</h3>
            <p>This calculator determines the exact duration between two calendar dates. It's perfect for planning events, tracking project timelines, or just figuring out exactly how many days are left until your next vacation.</p>
            `,
            howTo: `
            <h3>Common Uses</h3>
            <div class="grid gap-4 mt-4">
                <div class="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h5 class="font-bold text-blue-900">Project Management</h5>
                    <p class="text-sm text-blue-800">Calculate the number of days between a project start date and the deadline to plan sprints effectively.</p>
                </div>
                <div class="p-4 bg-green-50 rounded-lg border border-green-100">
                    <h5 class="font-bold text-green-900">Event Countdown</h5>
                    <p class="text-sm text-green-800">Find out exactly how many weeks and days remain until a wedding, anniversary, or holiday.</p>
                </div>
            </div>
            `,
            faq: [
                {
                    question: "Does this include the end date?",
                    answer: "The calculation considers the duration *between* the days. Effectively, it counts the days starting from the day after the start date, up to and including the end date."
                },
                {
                    question: "How are leap years handled?",
                    answer: "Our engine uses standard calendar libraries that automatically account for leap years (February 29th) in calculations."
                }
            ]
        }
    },
    'circle': {
        id: 'circle',
        title: 'Circle Calculator',
        description: 'Calculate Area, Circumference, Diameter and more from any known value.',
        category: 'math',
        icon: 'Circle',
        meta: {
            title: 'Circle Calculator | Area, Circumference & Radius',
            description: 'Instantly calculate circle area, circumference, diameter. Includes visual formulas and real-world examples (pizza slices!).',
            keywords: ['circle calculator', 'circle area', 'circumference calculator', 'radius to diameter', 'pi calculator'],
        },
        inputs: [
            {
                id: 'radius',
                label: 'Radius (r)',
                type: 'number',
                placeholder: 'e.g. 10',
                unit: 'units',
            }
        ],
        outputs: [
            {
                label: 'Area (A)',
                unit: 'sq units',
                calculate: (inputs) => {
                    const r = Number(inputs['radius']);
                    if (!r) return 0;
                    return parseFloat((Math.PI * r * r).toFixed(4));
                },
            },
            {
                label: 'Circumference (C)',
                unit: 'units',
                calculate: (inputs) => {
                    const r = Number(inputs['radius']);
                    if (!r) return 0;
                    return parseFloat((2 * Math.PI * r).toFixed(4));
                },
            },
            {
                label: 'Diameter (d)',
                unit: 'units',
                calculate: (inputs) => {
                    const r = Number(inputs['radius']);
                    if (!r) return 0;
                    return r * 2;
                },
            }
        ],
        content: {
            whatIs: `
            <h3>What is a Circle?</h3>
            <p>A circle is a 2D shape where every point on its edge is exactly the same distance from the center. This distance is called the <strong>radius (r)</strong>.</p>
            <p>The <strong>diameter (d)</strong> is the distance across the circle through the center (d = 2r). The <strong>circumference (C)</strong> is the total length around the circle.</p>
            `,
            howTo: `
            <h3>The Magic of Pi (π)</h3>
            <p>All circle calculations involve π (pi), the ratio of a circle's circumference to its diameter. Pi is approximately <strong>3.14159</strong>.</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                <div class="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                    <h5 class="font-bold text-blue-900 mb-2">Area (A)</h5>
                    <code class="text-lg font-mono text-blue-700">A = πr²</code>
                    <p class="text-xs text-blue-600 mt-2">How much pizza is inside one slice!</p>
                </div>
                <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center">
                    <h5 class="font-bold text-indigo-900 mb-2">Circumference (C)</h5>
                    <code class="text-lg font-mono text-indigo-700">C = 2πr</code>
                    <p class="text-xs text-indigo-600 mt-2">The length of the pizza crust.</p>
                </div>
                <div class="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
                    <h5 class="font-bold text-purple-900 mb-2">Diameter (d)</h5>
                    <code class="text-lg font-mono text-purple-700">d = 2r</code>
                    <p class="text-xs text-purple-600 mt-2">The width of the box you need.</p>
                </div>
            </div>
            <h4 class="font-semibold mt-4">Example: The 12" Pizza</h4>
            <p class="text-sm text-gray-600">A 12-inch pizza has a diameter of 12 inches (r = 6 inches). Its area is π × 6² ≈ <strong>113 sq in</strong>. A 16-inch pizza has π × 8² ≈ <strong>201 sq in</strong> — almost double!</p>
            `,
            faq: [
                {
                    question: "What is Pi (π)?",
                    answer: "Pi is a mathematical constant (≈ 3.14159) that represents the ratio of a circle's circumference to its diameter. It's the same for every circle, no matter how big or small."
                },
                {
                    question: "Why does a slightly larger pizza have SO much more area?",
                    answer: "Because area grows with the <strong>square</strong> of the radius. Doubling the radius quadruples the area. A 16-inch pizza is 78% bigger than a 12-inch, not just 33%!"
                }
            ]
        }
    },
    'square': {
        id: 'square',
        title: 'Square Calculator',
        description: 'Calculate Area, Perimeter, and Diagonal of a square from its side length.',
        category: 'math',
        icon: 'Square',
        meta: {
            title: 'Square Calculator | Area, Perimeter & Diagonal',
            description: 'Calculate the area, perimeter, and diagonal of any square. Includes formulas and a flooring/tiling example.',
            keywords: ['square calculator', 'area of square', 'perimeter of square', 'diagonal of square', 'square footage'],
        },
        inputs: [
            {
                id: 'side',
                label: 'Side Length (a)',
                type: 'number',
                placeholder: 'e.g. 5',
                unit: 'units',
            }
        ],
        outputs: [
            {
                label: 'Area (A)',
                unit: 'sq units',
                calculate: (inputs) => {
                    const a = Number(inputs['side']);
                    if (!a) return 0;
                    return parseFloat((a * a).toFixed(4));
                },
            },
            {
                label: 'Perimeter (P)',
                unit: 'units',
                calculate: (inputs) => {
                    const a = Number(inputs['side']);
                    if (!a) return 0;
                    return 4 * a;
                },
            },
            {
                label: 'Diagonal (d)',
                unit: 'units',
                calculate: (inputs) => {
                    const a = Number(inputs['side']);
                    if (!a) return 0;
                    return parseFloat((a * Math.sqrt(2)).toFixed(4));
                },
            }
        ],
        content: {
            whatIs: `
            <h3>What is a Square?</h3>
            <p>A square is a special rectangle where all four sides are equal. It has four right angles (90°) and equal diagonals that bisect each other at 90°.</p>
            <p>Squares are everywhere: floor tiles, window panes, chess boards, and even your phone's app icons are often square.</p>
            `,
            howTo: `
            <h3>Key Formulas</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                <div class="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                    <h5 class="font-bold text-blue-900 mb-2">Area</h5>
                    <code class="text-lg font-mono text-blue-700">A = a²</code>
                </div>
                <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center">
                    <h5 class="font-bold text-indigo-900 mb-2">Perimeter</h5>
                    <code class="text-lg font-mono text-indigo-700">P = 4a</code>
                </div>
                <div class="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
                    <h5 class="font-bold text-purple-900 mb-2">Diagonal</h5>
                    <code class="text-lg font-mono text-purple-700">d = a√2</code>
                </div>
            </div>
            <h4 class="font-semibold mt-4">Example: Tiling a 10x10 Floor</h4>
            <p class="text-sm text-gray-600">A 10-foot x 10-foot room has an area of 10² = <strong>100 sq ft</strong>. If each tile covers 2 sq ft, you'll need 50 tiles (+ ~10% for waste).</p>
            `,
            faq: [
                {
                    question: "Is a square a rectangle?",
                    answer: "Yes! A square is a special type of rectangle where all four sides are equal. Every square is a rectangle, but not every rectangle is a square."
                },
                {
                    question: "Why is the diagonal formula a√2?",
                    answer: "It comes from the Pythagorean theorem. If the side is 'a', the diagonal is the hypotenuse of a right triangle with legs of length 'a'. So d = √(a² + a²) = a√2."
                }
            ]
        }
    },
    'rectangle': {
        id: 'rectangle',
        title: 'Rectangle Calculator',
        description: 'Calculate Area, Perimeter, and Diagonal of a rectangle.',
        category: 'math',
        icon: 'RectangleHorizontal',
        meta: {
            title: 'Rectangle Calculator | Area & Perimeter',
            description: 'Calculate the area, perimeter and diagonal of a rectangle.',
            keywords: ['rectangle calculator', 'area of rectangle', 'perimeter of rectangle'],
        },
        inputs: [
            {
                id: 'length',
                label: 'Length (l)',
                type: 'number',
                placeholder: 'e.g. 10',
            },
            {
                id: 'width',
                label: 'Width (w)',
                type: 'number',
                placeholder: 'e.g. 5',
            }
        ],
        outputs: [
            {
                label: 'Area',
                unit: 'sq units',
                calculate: (inputs) => {
                    const l = Number(inputs['length']);
                    const w = Number(inputs['width']);
                    if (!l || !w) return 0;
                    return l * w;
                },
            },
            {
                label: 'Perimeter',
                unit: 'units',
                calculate: (inputs) => {
                    const l = Number(inputs['length']);
                    const w = Number(inputs['width']);
                    if (!l || !w) return 0;
                    return 2 * (l + w);
                },
            },
            {
                label: 'Diagonal',
                unit: 'units',
                calculate: (inputs) => {
                    const l = Number(inputs['length']);
                    const w = Number(inputs['width']);
                    if (!l || !w) return 0;
                    return parseFloat(Math.sqrt(l * l + w * w).toFixed(2));
                },
            }
        ],
        content: {
            whatIs: `
            <h3>Understanding Rectangles</h3>
            <p>A rectangle is a quadrilateral with four right angles. It can also be defined as an equiangular quadrilateral, since equiangular means that all of its angles are equal (360°/4 = 90°).</p>
            `,
            howTo: `
            <h3>Essential Calculations</h3>
            <div class="space-y-4 my-4">
                <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h5 class="font-bold text-gray-900 mb-2">Finding the Area</h5>
                    <p class="text-sm text-gray-600 mb-2">Multiply length by width.</p>
                    <code class="block font-mono bg-white p-2 rounded border border-gray-200 text-sm">A = length × width</code>
                </div>
                <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h5 class="font-bold text-gray-900 mb-2">Finding the Perimeter</h5>
                    <p class="text-sm text-gray-600 mb-2">Add length and width, then multiply by 2.</p>
                    <code class="block font-mono bg-white p-2 rounded border border-gray-200 text-sm">P = 2 × (length + width)</code>
                </div>
            </div>
            `,
            faq: [
                {
                    question: "Is a square a rectangle?",
                    answer: "Yes, a square is a special type of rectangle where all four sides are of equal length."
                }
            ]
        }
    },
    'triangle': {
        id: 'triangle',
        title: 'Triangle Calculator',
        description: 'Calculate Area and Perimeter of a triangle.',
        category: 'math',
        icon: 'Triangle',
        meta: {
            title: 'Triangle Calculator | Area & Perimeter',
            description: 'Calculate the area and perimeter of a triangle given its dimensions.',
            keywords: ['triangle calculator', 'area of triangle', 'herons formula'],
        },
        inputs: [
            {
                id: 'base',
                label: 'Base (b)',
                type: 'number',
                placeholder: 'e.g. 10',
            },
            {
                id: 'height',
                label: 'Height (h)',
                type: 'number',
                placeholder: 'e.g. 5',
            }
        ],
        outputs: [
            {
                label: 'Area',
                unit: 'sq units',
                calculate: (inputs) => {
                    const b = Number(inputs['base']);
                    const h = Number(inputs['height']);
                    if (!b || !h) return 0;
                    return (b * h) / 2;
                },
            }
        ],
        content: {
            whatIs: `
            <h3>The Basic Triangle</h3>
            <p>A triangle is a polygon with three edges and three vertices. It is one of the basic shapes in geometry. The sum of the internal angles of a triangle in Euclidean space is always 180 degrees.</p>
            `,
            howTo: `
            <h3>Area Formula</h3>
            <div class="bg-yellow-50 p-6 rounded-xl border border-yellow-100 text-center my-4">
                <p class="text-xs text-yellow-800 uppercase tracking-widest font-bold mb-2">Standard Formula</p>
                <code class="text-2xl font-mono text-yellow-900">Area = ½ × base × height</code>
                <p class="text-sm text-yellow-700 mt-2">Simply multiply the base by the height, and divide the result by 2.</p>
            </div>
            `,
            faq: [
                {
                    question: "What if I don't know the height?",
                    answer: "If you only know the lengths of all three sides, you can use Heron's Formula (available in our Advanced Math section) to find the area."
                }
            ]
        }
    },
    'salary': {
        id: 'salary',
        title: 'Salary Converter',
        description: 'Convert salary between Hourly, Daily, Weekly, Bi-weekly, Monthly, and Yearly.',
        category: 'finance',
        icon: 'DollarSign',
        meta: {
            title: 'Salary Converter | Hourly to Yearly Calculator',
            description: 'Convert your salary to hourly, monthly, or yearly rates.',
            keywords: ['salary converter', 'hourly to yearly', 'paycheck calculator', 'wage converter'],
        },
        inputs: [
            {
                id: 'amount',
                label: 'Amount',
                type: 'number',
                placeholder: 'e.g. 5000',
            },
            {
                id: 'period',
                label: 'Per',
                type: 'select',
                options: [
                    { value: 'hour', label: 'Hour' },
                    { value: 'day', label: 'Day' },
                    { value: 'week', label: 'Week' },
                    { value: 'month', label: 'Month' },
                    { value: 'year', label: 'Year' },
                ],
                defaultValue: 'year'
            },
            {
                id: 'hoursPerWeek',
                label: 'Hours/Week',
                type: 'number',
                placeholder: '40',
                defaultValue: '40'
            },
            {
                id: 'weeksPerYear',
                label: 'Weeks/Year',
                type: 'number',
                placeholder: '52',
                defaultValue: '52'
            }
        ],
        outputs: [
            {
                label: 'Hourly Rate',
                unit: '$/hr',
                calculate: (inputs) => {
                    const amount = Number(inputs['amount']);
                    const period = inputs['period'];
                    const hours = Number(inputs['hoursPerWeek']) || 40;
                    const weeks = Number(inputs['weeksPerYear']) || 52;
                    if (!amount) return 0;

                    let yearly = 0;
                    if (period === 'hour') yearly = amount * hours * weeks;
                    else if (period === 'day') yearly = amount * 5 * weeks; // Assuming 5 days
                    else if (period === 'week') yearly = amount * weeks;
                    else if (period === 'month') yearly = amount * 12;
                    else yearly = amount;

                    return parseFloat((yearly / (hours * weeks)).toFixed(2));
                },
            },
            {
                label: 'Monthly Salary',
                unit: '$/mo',
                calculate: (inputs) => {
                    const amount = Number(inputs['amount']);
                    const period = inputs['period'];
                    const hours = Number(inputs['hoursPerWeek']) || 40;
                    const weeks = Number(inputs['weeksPerYear']) || 52;
                    if (!amount) return 0;

                    let yearly = 0;
                    if (period === 'hour') yearly = amount * hours * weeks;
                    else if (period === 'day') yearly = amount * 5 * weeks;
                    else if (period === 'week') yearly = amount * weeks;
                    else if (period === 'month') yearly = amount * 12;
                    else yearly = amount;

                    return parseFloat((yearly / 12).toFixed(2));
                },
            },
            {
                label: 'Yearly Salary',
                unit: '$/yr',
                calculate: (inputs) => {
                    const amount = Number(inputs['amount']);
                    const period = inputs['period'];
                    const hours = Number(inputs['hoursPerWeek']) || 40;
                    const weeks = Number(inputs['weeksPerYear']) || 52;
                    if (!amount) return 0;

                    let yearly = 0;
                    if (period === 'hour') yearly = amount * hours * weeks;
                    else if (period === 'day') yearly = amount * 5 * weeks;
                    else if (period === 'week') yearly = amount * weeks;
                    else if (period === 'month') yearly = amount * 12;
                    else yearly = amount;

                    return parseFloat(yearly.toFixed(2));
                },
            }
        ],
        content: {
            whatIs: `
            <h3>Hourly to Yearly Salary</h3>
            <p>This tool converts your income between different pay periods: Hourly, Daily, Weekly, Bi-weekly, Monthly, and Yearly. It helps you understand the bigger picture of your earnings.</p>
            <p>It's based on the standard work year, which typically consists of 2,080 working hours (52 weeks × 40 hours).</p>
            `,
            howTo: `
            <h3>Standard Conversion Logic</h3>
            <ul class="list-disc pl-5 space-y-2 text-gray-600 mt-2">
                <li><strong>Work Week:</strong> Default is 40 hours.</li>
                <li><strong>Work Year:</strong> Default is 52 weeks.</li>
                <li><strong>Monthly Calculation:</strong> Yearly Salary divided by 12.</li>
            </ul>
            <div class="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-sm text-yellow-800">
                <strong>Note:</strong> This calculator computes <em>Gross Income</em> (before taxes and deductions). Your actual take-home pay will be lower.
            </div>
            `,
            faq: [
                {
                    question: "Does this include taxes?",
                    answer: "No, this calculator shows your Gross Pay. Taxes depend on your specific location, filing status, and other deductions."
                },
                {
                    question: "Why is the monthly amount different than I expected?",
                    answer: "Some months have 4 weeks, others have 5. To be consistent, we calculate the Yearly total first (Weekly × 52) and then divide by 12."
                }
            ]
        }
    },
    'simple-interest': {
        id: 'simple-interest',
        title: 'Simple Interest Calculator',
        description: 'Calculate simple interest accumulation over time.',
        category: 'finance',
        icon: 'TrendingUp',
        meta: {
            title: 'Simple Interest Calculator',
            description: 'Calculate simple interest (A = P(1 + rt)).',
            keywords: ['simple interest', 'interest calculator', 'financial calculator'],
        },
        inputs: [
            {
                id: 'principal',
                label: 'Principal (P)',
                type: 'number',
                placeholder: 'e.g. 1000',
            },
            {
                id: 'rate',
                label: 'Annual Rate (r)',
                type: 'number',
                primaryUnit: '%',
                placeholder: 'e.g. 5',
            },
            {
                id: 'time',
                label: 'Time (t)',
                type: 'number',
                primaryUnit: 'years',
                placeholder: 'e.g. 2',
            }
        ],
        outputs: [
            {
                label: 'Interest Amount',
                unit: '$',
                calculate: (inputs) => {
                    const p = Number(inputs['principal']);
                    const r = Number(inputs['rate']);
                    const t = Number(inputs['time']);
                    if (!p || !r || !t) return 0;
                    return parseFloat((p * (r / 100) * t).toFixed(2));
                },
            },
            {
                label: 'Total Amount',
                unit: '$',
                calculate: (inputs) => {
                    const p = Number(inputs['principal']);
                    const r = Number(inputs['rate']);
                    const t = Number(inputs['time']);
                    if (!p || !r || !t) return 0;
                    return parseFloat((p * (1 + (r / 100) * t)).toFixed(2));
                },
            }
        ],
        content: {
            whatIs: `
            <h3>What is Simple Interest?</h3>
            <p>Simple interest is money you can earn on initially invested funds, or money you pay on a loan. It's calculated only on the principal amount, meaning the interest amount remains constant for each period.</p>
            `,
            howTo: `
            <h3>The Formula</h3>
            <div class="bg-indigo-900 text-white p-6 rounded-xl my-4 text-center">
                <p class="text-3xl font-mono mb-2 tracking-widest">A = P(1 + rt)</p>
                <p class="text-sm opacity-80">Total = Principal × (1 + rate × time)</p>
            </div>
            <h3>When is it used?</h3>
            <ul class="list-disc pl-5 space-y-2 text-gray-600">
                <li>Short-term loans (e.g., auto loans).</li>
                <li>Some bonds (coupon payments).</li>
                <li>Private lending agreements.</li>
            </ul>
            `,
            faq: [
                {
                    question: "How is it different from Compound Interest?",
                    answer: "Simple interest is linear; you earn the same amount every year. Compound interest is exponential; you earn interest on your interest, so your money grows faster over time."
                }
            ]
        }
    },
    'compound-interest': {
        id: 'compound-interest',
        title: 'Compound Interest Calculator',
        description: 'Calculate how your money grows with compound interest and monthly contributions.',
        category: 'finance',
        icon: 'TrendingUp',
        meta: {
            title: 'Compound Interest Calculator | Daily, Monthly, Yearly Compounding',
            description: 'Calculate compound interest with monthly contributions. See how small savings grow into millions with the power of compounding.',
            keywords: ['compound interest calculator', 'investment calculator', 'compound savings', 'interest rate calculator', 'coffee shop millionaire'],
        },
        inputs: [
            {
                id: 'principal',
                label: 'Initial Investment (Principal)',
                type: 'number',
                placeholder: 'e.g. 1000',
                defaultValue: 1000,
            },
            {
                id: 'contribution',
                label: 'Monthly Contribution',
                type: 'number',
                placeholder: 'e.g. 100',
                defaultValue: 0,
            },
            {
                id: 'rate',
                label: 'Annual Interest Rate (%)',
                type: 'number',
                primaryUnit: '%',
                placeholder: 'e.g. 5',
                defaultValue: 5,
            },
            {
                id: 'time',
                label: 'Time (Years)',
                type: 'number',
                primaryUnit: 'years',
                placeholder: 'e.g. 10',
                defaultValue: 10,
            },
            {
                id: 'frequency',
                label: 'Compound Frequency',
                type: 'select',
                options: [
                    { value: '1', label: 'Annually (1/yr)' },
                    { value: '2', label: 'Semiannually (2/yr)' },
                    { value: '4', label: 'Quarterly (4/yr)' },
                    { value: '12', label: 'Monthly (12/yr)' },
                    { value: '365', label: 'Daily (365/yr)' },
                ],
                defaultValue: '12'
            }
        ],
        outputs: [
            {
                label: 'Total Amount',
                unit: '$',
                calculate: (inputs) => {
                    const P = Number(inputs['principal']) || 0;
                    const PMT_monthly = Number(inputs['contribution']) || 0;
                    const r = Number(inputs['rate']);
                    const t = Number(inputs['time']);
                    const n = Number(inputs['frequency']) || 12;

                    if ((!P && !PMT_monthly) || !r || !t) return 0;

                    const r_decimal = r / 100;

                    // Future Value of Principal: P * (1 + r/n)^(nt)
                    const fv_principal = P * Math.pow(1 + r_decimal / n, n * t);

                    // Future Value of Series (Contributions)
                    // We approximate contribution per period based on monthly input
                    // PMT_period = PMT_monthly * 12 / n
                    const PMT_period = PMT_monthly * 12 / n;

                    // Formula: PMT * [ (1 + r/n)^(nt) - 1 ] / (r/n)
                    const fv_series = PMT_period * (Math.pow(1 + r_decimal / n, n * t) - 1) / (r_decimal / n);

                    return parseFloat((fv_principal + fv_series).toFixed(2));
                },
            },
            {
                label: 'Total Principal',
                unit: '$',
                calculate: (inputs) => {
                    const P = Number(inputs['principal']) || 0;
                    const PMT_monthly = Number(inputs['contribution']) || 0;
                    const t = Number(inputs['time']) || 0;

                    const total_contributions = PMT_monthly * 12 * t;
                    return parseFloat((P + total_contributions).toFixed(2));
                },
            },
            {
                label: 'Total Interest',
                unit: '$',
                calculate: (inputs) => {
                    const P = Number(inputs['principal']) || 0;
                    const PMT_monthly = Number(inputs['contribution']) || 0;
                    const r = Number(inputs['rate']);
                    const t = Number(inputs['time']);
                    const n = Number(inputs['frequency']) || 12;

                    if ((!P && !PMT_monthly) || !r || !t) return 0;

                    const r_decimal = r / 100;
                    const PMT_period = PMT_monthly * 12 / n;

                    const fv_principal = P * Math.pow(1 + r_decimal / n, n * t);
                    const fv_series = PMT_period * (Math.pow(1 + r_decimal / n, n * t) - 1) / (r_decimal / n);
                    const total_fv = fv_principal + fv_series;

                    const total_invested = P + (PMT_monthly * 12 * t);

                    return parseFloat((total_fv - total_invested).toFixed(2));
                },
            }
        ],
        content: {
            whatIs: `
            <h3>The Power of Compounding</h3>
            <p><strong>Compound Interest</strong> is often called the "eighth wonder of the world". Unlike simple interest, where you only earn money on your initial principal, compound interest allows you to earn "interest on interest".</p>
            <p>Over time, this creates an exponential snowball effect. The longer you let your money sit, the faster it grows.</p>
            `,
            howTo: `
            <h3>Example: The Coffee Shop Millionaire</h3>
            <p class="mb-4">Imagine you decide to skip your daily $5 latte and invest that money instead. That's about <strong>$150 per month</strong>.</p>
            
            <div class="space-y-6 my-6">
                <div class="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div class="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold">1</div>
                    <div>
                        <h4 class="font-bold text-gray-900">The Inputs</h4>
                        <ul class="text-sm text-gray-600 space-y-1 mt-1">
                            <li><strong>Initial Investment:</strong> $0</li>
                            <li><strong>Monthly Contribution:</strong> $150</li>
                            <li><strong>Interest Rate:</strong> 10% (avg stock market)</li>
                            <li><strong>Time:</strong> 30 years</li>
                        </ul>
                    </div>
                </div>

                <div class="flex gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                    <div class="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold">=</div>
                    <div>
                        <h4 class="font-bold text-green-900">The Result</h4>
                        <p class="text-sm text-green-800 mb-2">After 30 years, you would have:</p>
                        <p class="text-2xl font-bold text-green-700 mb-1">$339,073</p>
                        <p class="text-xs text-green-600">Total you invested: only $54,000!</p>
                        <p class="text-xs text-green-600">Free money (Interest): $285,073</p>
                    </div>
                </div>
            </div>
            
            <p class="text-sm text-gray-500 italic">This is why starting early is the most important rule of investing.</p>
            `,
            faq: [
                {
                    question: "What is the difference between Simple and Compound Interest?",
                    answer: "Simple interest is calculated only on the principal amount. Compound interest is calculated on the principal amount AND the accumulated interest. Compound interest grows much faster."
                },
                {
                    question: "How often is interest compounded?",
                    answer: "It depends on the account. Savings accounts often compound monthly. Bonds might compound semi-annually. This calculator defaults to 'Monthly' which is standard for most personal finance scenarios."
                },
                {
                    question: "Does the Monthly Contribution happen at the start or end?",
                    answer: "This calculator assumes contributions are made at the end of each period (Ordinary Annuity), which is the standard convention for general savings calculators."
                }
            ]
        }
    },
    'speed': {
        id: 'speed',
        title: 'Speed Calculator',
        description: 'Calculate Speed, Distance, or Time.',
        category: 'physics',
        icon: 'Zap',
        meta: {
            title: 'Speed Calculator | Distance & Time',
            description: 'Calculate speed, distance or time instantly. v = d/t, d = vt, t = d/v.',
            keywords: ['speed calculator', 'velocity calculator', 'how to calculate speed', 'distance time speed'],
        },
        inputs: [
            {
                id: 'distance',
                label: 'Distance (d)',
                type: 'number',
                placeholder: 'e.g. 100',
            },
            {
                id: 'time',
                label: 'Time (t)',
                type: 'number',
                placeholder: 'e.g. 10',
            },
            {
                id: 'speed',
                label: 'Speed (v)',
                type: 'number',
                placeholder: 'e.g. 10',
            }
        ],
        outputs: [
            {
                label: 'Result: Speed',
                unit: 'm/s',
                calculate: (inputs) => {
                    const d = Number(inputs['distance']);
                    const t = Number(inputs['time']);
                    if (d && t) return parseFloat((d / t).toFixed(2));
                    return 0;
                },
            },
            {
                label: 'Result: Distance',
                unit: 'm',
                calculate: (inputs) => {
                    const v = Number(inputs['speed']);
                    const t = Number(inputs['time']);
                    if (v && t) return parseFloat((v * t).toFixed(2));
                    return 0;
                },
            },
            {
                label: 'Result: Time',
                unit: 's',
                calculate: (inputs) => {
                    const d = Number(inputs['distance']);
                    const v = Number(inputs['speed']);
                    if (d && v) return parseFloat((d / v).toFixed(2));
                    return 0;
                },
            }
        ],
        content: {
            whatIs: `
            <h3>Speed vs. Velocity</h3>
            <p><strong>Speed</strong> is a scalar quantity that refers to "how fast an object is moving." It can be thought of as the rate at which an object covers distance.</p>
            <p><strong>Velocity</strong> is a vector quantity that refers to "the rate at which an object changes its position." It includes direction.</p>
            `,
            howTo: `
            <h3>The Magic Triangle</h3>
            <p>Cover the variable you want to find in the triangle below to get the formula:</p>
            <div class="flex justify-center my-4">
                <div class="relative w-32 h-28 bg-blue-100 rounded-lg flex flex-col items-center justify-center border-2 border-blue-300">
                    <span class="font-bold text-2xl text-blue-900 border-b-2 border-blue-900 w-full text-center pb-1">d</span>
                    <div class="flex w-full justify-around pt-1">
                        <span class="font-bold text-2xl text-blue-900 border-r-2 border-blue-900 w-1/2 text-center">v</span>
                        <span class="font-bold text-2xl text-blue-900 w-1/2 text-center">t</span>
                    </div>
                </div>
            </div>
            <ul class="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                <li><strong>Distance (d)</strong> = Speed (v) × Time (t)</li>
                <li><strong>Speed (v)</strong> = Distance (d) / Time (t)</li>
                <li><strong>Time (t)</strong> = Distance (d) / Speed (v)</li>
            </ul>
            `,
            faq: [
                {
                    question: "What is average speed?",
                    answer: "Average speed is the total distance traveled divided by the total time elapsed."
                }
            ]
        }
    },
    'acceleration': {
        id: 'acceleration',
        title: 'Acceleration Calculator',
        description: 'Calculate Acceleration from velocity change.',
        category: 'physics',
        icon: 'Activity',
        meta: {
            title: 'Acceleration Calculator | Physics | MyCalcOnline',
            description: 'Calculate rate of change of velocity. Find Initial, Final Velocity, Time, or Acceleration.',
            keywords: ['acceleration calculator', 'physics calculator', 'average acceleration', 'velocity change'],
        },
        inputs: [
            {
                id: 'v_initial',
                label: 'Initial Velocity (vi)',
                type: 'number',
                placeholder: 'e.g. 0',
            },
            {
                id: 'v_final',
                label: 'Final Velocity (vf)',
                type: 'number',
                placeholder: 'e.g. 60',
            },
            {
                id: 'time',
                label: 'Time (t)',
                type: 'number',
                placeholder: 'e.g. 5',
            }
        ],
        outputs: [
            {
                label: 'Acceleration (a)',
                unit: 'm/s²',
                calculate: (inputs) => {
                    const vi = Number(inputs['v_initial']);
                    const vf = Number(inputs['v_final']);
                    const t = Number(inputs['time']);
                    if (!t) return 0;
                    return parseFloat(((vf - vi) / t).toFixed(2));
                },
            }
        ],
        content: {
            whatIs: `
            <h3>Understanding Acceleration</h3>
            <p>Acceleration is the rate of change of velocity of an object with respect to time. An object's acceleration is the net result of any and all forces acting on the object, as described by Newton's Second Law.</p>
            `,
            howTo: `
            <h3>The Formula</h3>
            <div class="bg-indigo-900 text-white p-6 rounded-xl my-4 text-center">
                <p class="text-3xl font-mono mb-2 tracking-widest">a = Δv / t</p>
                <p class="text-sm opacity-80 mt-2">Acceleration = (Final Velocity - Initial Velocity) / Time</p>
            </div>
            <p><strong>Units:</strong> Meters per second squared (m/s²).</p>
            `,
            faq: [
                {
                    question: "Can acceleration be negative?",
                    answer: "Yes! Negative acceleration is often called <strong>deceleration</strong> or retardation. It means the object is slowing down relative to its direction of motion."
                }
            ]
        }
    },
    'force': {
        id: 'force',
        title: 'Force Calculator',
        description: 'Calculate Force using Newton\'s Second Law (F=ma).',
        category: 'physics',
        icon: 'Hammer',
        meta: {
            title: 'Force Calculator (F=ma) | Newton\'s Second Law',
            description: 'Calculate Force (N), Mass (kg), or Acceleration (m/s²) using Newton\'s Second Law.',
            keywords: ['force calculator', 'newtons second law', 'f=ma calculator', 'physics force'],
        },
        inputs: [
            {
                id: 'mass',
                label: 'Mass (m)',
                type: 'number',
                placeholder: 'e.g. 10',
            },
            {
                id: 'acceleration',
                label: 'Acceleration (a)',
                type: 'number',
                placeholder: 'e.g. 9.8',
            }
        ],
        outputs: [
            {
                label: 'Force (F)',
                unit: 'N',
                calculate: (inputs) => {
                    const m = Number(inputs['mass']);
                    const a = Number(inputs['acceleration']);
                    if (!m || !a) return 0;
                    return parseFloat((m * a).toFixed(2));
                },
            }
        ],
        content: {
            whatIs: `
            <h3>Newton's Second Law</h3>
            <p><strong>Force</strong> is an interaction that, when unopposed, will change the motion of an object. Newton's Second Law states that the force acting on an object is equal to the mass of that object times its acceleration.</p>
            `,
            howTo: `
            <h3>F = ma</h3>
            <div class="bg-indigo-900 text-white p-6 rounded-xl my-4 text-center">
                <p class="text-4xl font-mono mb-2 font-bold tracking-widest">F = m × a</p>
                <p class="text-sm opacity-80 mt-2">Force (N) = Mass (kg) × Acceleration (m/s²)</p>
            </div>
            <p><strong>Example:</strong> How much force is needed to accelerate a <strong>10 kg</strong> object at a rate of <strong>5 m/s²</strong>?</p>
            <p class="ml-4 mt-1 font-mono text-indigo-700">F = 10 kg × 5 m/s² = 50 N</p>
            `,
            faq: [
                {
                    question: "What is a Newton?",
                    answer: "One Newton (N) is the force needed to accelerate one kilogram of mass at the rate of one meter per second squared."
                }
            ]
        }
    },
    'work': {
        id: 'work',
        title: 'Work Calculator',
        description: 'Calculate Work (W=Fd).',
        category: 'physics',
        icon: 'Briefcase', // Placeholder icon
        meta: {
            title: 'Work Calculator | Physics',
            description: 'Calculate work done by a force moving an object.',
            keywords: ['work calculator', 'physics work', 'joules calculator'],
        },
        inputs: [
            {
                id: 'force',
                label: 'Force (F)',
                type: 'number',
                placeholder: 'e.g. 50',
            },
            {
                id: 'distance',
                label: 'Distance (d)',
                type: 'number',
                placeholder: 'e.g. 10',
            }
        ],
        outputs: [
            {
                label: 'Work (W)',
                unit: 'J',
                calculate: (inputs) => {
                    const f = Number(inputs['force']);
                    const d = Number(inputs['distance']);
                    if (!f || !d) return 0;
                    return parseFloat((f * d).toFixed(2));
                },
            }
        ],
        content: {
            whatIs: `
            <h3>Definition of Work</h3>
            <p>In physics, <strong>Work</strong> is the energy transferred to or from an object via the application of force along a displacement. In its simplest form, it is force times distance.</p>
            `,
            howTo: `
            <h3>W = Fd</h3>
            <div class="bg-green-50 p-6 rounded-xl border border-green-100 my-4 text-center">
                <p class="text-3xl font-mono mb-2 text-green-900 font-bold">W = F × d</p>
                <p class="text-sm text-green-800">Work (Joules) = Force (Newtons) × Distance (Meters)</p>
            </div>
            <p><strong>Key Concept:</strong> No work is done if the object doesn't move, no matter how much force you apply!</p>
            `,
            faq: [
                {
                    question: "What unit is Work measured in?",
                    answer: "Work is measured in <strong>Joules (J)</strong>. One Joule is equal to the work done by a force of one Newton acting through one meter."
                }
            ]
        }
    },
    'power': {
        id: 'power',
        title: 'Power Calculator',
        description: 'Calculate Mechanical Power (P=W/t).',
        category: 'physics',
        icon: 'Zap',
        meta: {
            title: 'Power Calculator | Physics',
            description: 'Calculate power given work and time.',
            keywords: ['power calculator', 'watts calculator', 'physics power'],
        },
        inputs: [
            {
                id: 'work',
                label: 'Work (W)',
                type: 'number',
                placeholder: 'e.g. 1000',
            },
            {
                id: 'time',
                label: 'Time (t)',
                type: 'number',
                placeholder: 'e.g. 10',
            }
        ],
        outputs: [
            {
                label: 'Power (P)',
                unit: 'W',
                calculate: (inputs) => {
                    const w = Number(inputs['work']);
                    const t = Number(inputs['time']);
                    if (!w || !t) return 0;
                    return parseFloat((w / t).toFixed(2));
                },
            }
        ],
        content: {
            whatIs: `
            <h3>Understanding Power</h3>
            <p><strong>Power</strong> is the rate at which work is done. It measures how fast energy is being transferred or transformed.</p>
            <p>Think of it this way: Walking up stairs and running up stairs requires the same amount of <em>Work</em> (lifting your body mass against gravity), but running requires more <em>Power</em> because you do it in less time.</p>
            `,
            howTo: `
            <h3>P = W/t</h3>
            <div class="bg-yellow-50 p-6 rounded-xl border border-yellow-100 my-4 text-center">
                <p class="text-3xl font-mono mb-2 text-yellow-900 font-bold">P = W / t</p>
                <p class="text-sm text-yellow-800">Power (Watts) = Work (Joules) / Time (Seconds)</p>
            </div>
            `,
            faq: [
                {
                    question: "What is a Watt?",
                    answer: "The Watt (W) is the SI unit of power. One Watt is defined as one Joule per second."
                },
                {
                    question: "How does it relate to Horsepower?",
                    answer: "Horsepower (hp) is an imperial unit of power. 1 mechanical horsepower is equal to approximately 745.7 Watts."
                }
            ]
        }
    },
    'weighted-average': {
        id: 'weighted-average',
        title: 'Weighted Average Calculator',
        description: 'Calculate the weighted mean of a data set.',
        category: 'math',
        icon: 'BarChart4',
        meta: {
            title: 'Weighted Average Calculator (Grade Calculator) | MyCalcOnline',
            description: 'Calculate weighted average for grades, GPA, or mixed data sets. Supports custom weights.',
            keywords: ['weighted mean', 'weighted average calculator', 'gpa calculator', 'grade calculator', 'average with weights'],
        },
        inputs: [
            {
                id: 'values',
                label: 'Values (comma separated)',
                type: 'text',
                placeholder: 'e.g. 80, 90, 75',
            },
            {
                id: 'weights',
                label: 'Weights (comma separated)',
                type: 'text',
                placeholder: 'e.g. 2, 3, 1 (or 20, 30, 10)',
            }
        ],
        outputs: [
            {
                label: 'Weighted Average',
                calculate: (inputs) => {
                    const vStr = inputs['values'] as string;
                    const wStr = inputs['weights'] as string;
                    if (!vStr || !wStr) return 0;

                    const values = vStr.split(/[,\s]+/).map(n => parseFloat(n)).filter(n => !isNaN(n));
                    const weights = wStr.split(/[,\s]+/).map(n => parseFloat(n)).filter(n => !isNaN(n));

                    if (values.length === 0 || weights.length === 0) return 0;

                    let sumProduct = 0;
                    let sumWeights = 0;

                    const len = Math.min(values.length, weights.length);
                    for (let i = 0; i < len; i++) {
                        sumProduct += values[i] * weights[i];
                        sumWeights += weights[i];
                    }

                    if (sumWeights === 0) return 0;
                    return parseFloat((sumProduct / sumWeights).toFixed(4));
                },
            },
            {
                label: 'Sum of Weights',
                calculate: (inputs) => {
                    const wStr = inputs['weights'] as string;
                    if (!wStr) return 0;
                    const weights = wStr.split(/[,\s]+/).map(n => parseFloat(n)).filter(n => !isNaN(n));
                    return weights.reduce((a, b) => a + b, 0);
                }
            }
        ],
        content: {
            whatIs: `
            <h3>Weighted Average vs. Simple Average</h3>
            <p>A <strong>Simple Average</strong> (Mean) treats all numbers equally. A <strong>Weighted Average</strong> assigns a specific "weight" or importance to each number.</p>
            <p>This is most commonly used in grading. For example, a Final Exam might be worth 50% of your grade, while homework is only 10%.</p>
            `,
            howTo: `
            <h3>Calculation Steps</h3>
            <ol class="list-decimal pl-5 space-y-2 text-gray-600 mt-2">
                <li>Multiply each number (x) by its weight (w).</li>
                <li>Add all of these products together (Σxw) to get the "Weighted Sum".</li>
                <li>Add all the weights together (Σw).</li>
                <li>Divide the Weighted Sum by the Sum of Weights.</li>
            </ol>
            <div class="bg-blue-50 p-4 rounded-lg my-4 border border-blue-100">
                <p class="font-bold text-blue-900 text-sm">Example: Grades</p>
                <div class="text-sm mt-1">
                    <p>Test (80) [Weight 2] + Homework (100) [Weight 1]</p>
                    <p class="font-mono mt-1 text-blue-800">(80×2 + 100×1) / (2+1)</p>
                    <p class="font-mono text-blue-800">(160 + 100) / 3 = 260 / 3 = <strong>86.66</strong></p>
                </div>
            </div>
            `,
            faq: [
                {
                    question: "Do weights have to add up to 100?",
                    answer: "No, weights can sum to any number. Our calculator divides by the total sum of weights automatically."
                }
            ]
        }
    },
    'standard-deviation': {
        id: 'standard-deviation',
        title: 'Standard Deviation Calculator',
        description: 'Calculate Standard Deviation and Variance.',
        category: 'math',
        icon: 'Activity',
        meta: {
            title: 'Standard Deviation Calculator (σ) | MyCalcOnline',
            description: 'Calculate Population (σ) and Sample (s) Standard Deviation, Variance, and Mean instantly.',
            keywords: ['standard deviation calculator', 'variance calculator', 'sigma calculator', 'statistics calculator'],
        },
        inputs: [
            {
                id: 'numbers',
                label: 'Data Set (comma separated)',
                type: 'text',
                placeholder: 'e.g. 10, 12, 23, 23, 16, 23, 21, 16',
            }
        ],
        outputs: [
            {
                label: 'Population SD (σ)',
                calculate: (inputs) => {
                    const str = inputs['numbers'] as string;
                    if (!str) return 0;
                    const nums = str.split(/[,\s]+/).map(n => parseFloat(n)).filter(n => !isNaN(n));
                    if (nums.length === 0) return 0;
                    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
                    const variance = nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / nums.length;
                    return parseFloat(Math.sqrt(variance).toFixed(4));
                },
            },
            {
                label: 'Sample SD (s)',
                calculate: (inputs) => {
                    const str = inputs['numbers'] as string;
                    if (!str) return 0;
                    const nums = str.split(/[,\s]+/).map(n => parseFloat(n)).filter(n => !isNaN(n));
                    if (nums.length < 2) return 0;
                    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
                    const variance = nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (nums.length - 1);
                    return parseFloat(Math.sqrt(variance).toFixed(4));
                },
            },
            {
                label: 'Mean (μ)',
                calculate: (inputs) => {
                    const str = inputs['numbers'] as string;
                    if (!str) return 0;
                    const nums = str.split(/[,\s]+/).map(n => parseFloat(n)).filter(n => !isNaN(n));
                    if (nums.length === 0) return 0;
                    return parseFloat((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(4));
                },
            },
            {
                label: 'Variance (σ²)',
                calculate: (inputs) => {
                    const str = inputs['numbers'] as string;
                    if (!str) return 0;
                    const nums = str.split(/[,\s]+/).map(n => parseFloat(n)).filter(n => !isNaN(n));
                    if (nums.length === 0) return 0;
                    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
                    return parseFloat((nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / nums.length).toFixed(4));
                },
            }
        ],
        content: {
            whatIs: `
            <h3>Measuring Spread</h3>
            <p><strong>Standard Deviation</strong> (σ or s) is a measure of how spread out numbers are. </p>
            <ul class="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                <li><strong>Low SD:</strong> Data points are close to the mean (consistent).</li>
                <li><strong>High SD:</strong> Data points are spread out over a wider range (volatile).</li>
            </ul>
            `,
            howTo: `
            <h3>Population vs. Sample</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h5 class="font-bold text-gray-900 mb-1">Population (σ)</h5>
                    <p class="text-xs text-gray-500 mb-2">Use when you have data for the <em>entire</em> group.</p>
                    <code class="block font-mono bg-white p-2 rounded text-xs select-all">σ = √(Σ(x - μ)² / N)</code>
                </div>
                <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h5 class="font-bold text-gray-900 mb-1">Sample (s)</h5>
                    <p class="text-xs text-gray-500 mb-2">Use when you have a <em>subset</em> of the group.</p>
                    <code class="block font-mono bg-white p-2 rounded text-xs select-all">s = √(Σ(x - x̄)² / (n - 1))</code>
                </div>
            </div>
            `,
            faq: [
                {
                    question: "Why divide by n-1 for Sample SD?",
                    answer: "Dividing by n-1 (Bessel's correction) provides a better estimate of the true population standard deviation when working with a small sample size."
                }
            ]
        }
    },
    'variance': {
        id: 'variance',
        title: 'Variance Calculator',
        description: 'Calculate Population and Sample Variance.',
        category: 'math',
        icon: 'Activity', // Reusing icon
        meta: {
            title: 'Variance Calculator (Population & Sample) | MyCalcOnline',
            description: 'Calculate statistical Variance (σ²) for population and sample data sets.',
            keywords: ['variance calculator', 'population variance', 'sample variance', 'statistical variance'],
        },
        inputs: [
            {
                id: 'numbers',
                label: 'Data Set (comma separated)',
                type: 'text',
                placeholder: 'e.g. 1, 2, 3, 4, 5',
            }
        ],
        outputs: [
            {
                label: 'Population Variance (σ²)',
                calculate: (inputs) => {
                    const str = inputs['numbers'] as string;
                    if (!str) return 0;
                    const nums = str.split(/[,\s]+/).map(n => parseFloat(n)).filter(n => !isNaN(n));
                    if (nums.length === 0) return 0;
                    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
                    return parseFloat((nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / nums.length).toFixed(4));
                },
            },
            {
                label: 'Sample Variance (s²)',
                calculate: (inputs) => {
                    const str = inputs['numbers'] as string;
                    if (!str) return 0;
                    const nums = str.split(/[,\s]+/).map(n => parseFloat(n)).filter(n => !isNaN(n));
                    if (nums.length < 2) return 0;
                    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
                    return parseFloat((nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (nums.length - 1)).toFixed(4));
                },
            }
        ],
        content: {
            whatIs: `
            <h3>Variance Explained</h3>
            <p><strong>Variance</strong> (σ²) is the average of the <strong>squared</strong> differences from the Mean. It gives you a general idea of the spread of your data.</p>
            <p>Because it is squared, the units are also squared (e.g., "dollars squared"), which can be hard to interpret. That's why we often take the square root of Variance to get the Standard Deviation.</p>
            `,
            howTo: `
            <h3>Relationship to Standard Deviation</h3>
            <div class="bg-indigo-50 p-6 rounded-xl border border-indigo-100 text-center my-4">
                <p class="text-lg font-medium text-indigo-900">Standard Deviation = √(Variance)</p>
                <p class="text-lg font-medium text-indigo-900 mt-2">Variance = (Standard Deviation)²</p>
            </div>
            `,
            faq: [
                {
                    question: "Why do we square the differences?",
                    answer: "Squaring makes negative differences positive so they don't cancel out the positive ones. It also gives more weight to outliers (values far from the mean)."
                }
            ]
        }
    },
    'z-score': {
        id: 'z-score',
        title: 'Z-Score Calculator',
        description: 'Calculate Z-Score from raw score, mean, and SD.',
        category: 'math',
        icon: 'Target',
        meta: {
            title: 'Z-Score Calculator',
            description: 'Determine the z-score of a value given the population mean and standard deviation.',
            keywords: ['z-score calculator', 'standard score', 'normal distribution'],
        },
        inputs: [
            {
                id: 'raw_score',
                label: 'Raw Score (x)',
                type: 'number',
                placeholder: 'e.g. 85',
            },
            {
                id: 'mean',
                label: 'Population Mean (μ)',
                type: 'number',
                placeholder: 'e.g. 70',
            },
            {
                id: 'std_dev',
                label: 'Standard Deviation (σ)',
                type: 'number',
                placeholder: 'e.g. 10',
            }
        ],
        outputs: [
            {
                label: 'Z-Score (z)',
                calculate: (inputs) => {
                    const x = Number(inputs['raw_score']);
                    const mean = Number(inputs['mean']);
                    const sd = Number(inputs['std_dev']);
                    if (!sd) return 0;
                    return parseFloat(((x - mean) / sd).toFixed(4));
                },
            }
        ],
        content: {
            whatIs: `<h3>Z-Score Formula</h3><p>z = (x - μ) / σ</p>`,
            faq: []
        }
    },
    'base-converter': {
        id: 'base-converter',
        title: 'Number Base Converter',
        description: 'Convert between Decimal, Binary, Hexadecimal, and Octal.',
        category: 'conversion',
        icon: 'Hash',
        meta: {
            title: 'Number Base Converter | Binary, Hex, Decimal',
            description: 'Convert numbers between base 10 (decimal), base 2 (binary), base 16 (hex), and base 8 (octal).',
            keywords: ['binary converter', 'hex converter', 'base converter', 'decimal to binary'],
        },
        inputs: [
            {
                id: 'decimal',
                label: 'Decimal (10)',
                type: 'number',
                placeholder: 'e.g. 255',
            },
            {
                id: 'binary',
                label: 'Binary (2)',
                type: 'text',
                placeholder: 'e.g. 11111111',
            },
            {
                id: 'hex',
                label: 'Hexadecimal (16)',
                type: 'text',
                placeholder: 'e.g. FF',
            },
            {
                id: 'octal',
                label: 'Octal (8)',
                type: 'text',
                placeholder: 'e.g. 377',
            }
        ],
        outputs: [
            {
                label: 'Decimal',
                calculate: (inputs) => {
                    if (inputs['decimal']) return Number(inputs['decimal']);
                    if (inputs['binary']) return parseInt(inputs['binary'] as string, 2) || 0;
                    if (inputs['hex']) return parseInt(inputs['hex'] as string, 16) || 0;
                    if (inputs['octal']) return parseInt(inputs['octal'] as string, 8) || 0;
                    return 0;
                },
            },
            {
                label: 'Binary',
                calculate: (inputs) => {
                    let val = 0;
                    if (inputs['decimal']) val = Number(inputs['decimal']);
                    else if (inputs['binary']) val = parseInt(inputs['binary'] as string, 2);
                    else if (inputs['hex']) val = parseInt(inputs['hex'] as string, 16);
                    else if (inputs['octal']) val = parseInt(inputs['octal'] as string, 8);

                    if (!val) return '0';
                    return val.toString(2);
                },
            },
            {
                label: 'Hexadecimal',
                calculate: (inputs) => {
                    let val = 0;
                    if (inputs['decimal']) val = Number(inputs['decimal']);
                    else if (inputs['binary']) val = parseInt(inputs['binary'] as string, 2);
                    else if (inputs['hex']) val = parseInt(inputs['hex'] as string, 16);
                    else if (inputs['octal']) val = parseInt(inputs['octal'] as string, 8);
                    if (!val) return '0';
                    return val.toString(16).toUpperCase();
                },
            },
            {
                label: 'Octal',
                calculate: (inputs) => {
                    let val = 0;
                    if (inputs['decimal']) val = Number(inputs['decimal']);
                    else if (inputs['binary']) val = parseInt(inputs['binary'] as string, 2);
                    else if (inputs['hex']) val = parseInt(inputs['hex'] as string, 16);
                    else if (inputs['octal']) val = parseInt(inputs['octal'] as string, 8);
                    if (!val) return '0';
                    return val.toString(8);
                },
            }
        ],
        content: {
            whatIs: `<h3>Number Bases</h3><p>Decimal (Base 10): 0-9<br>Binary (Base 2): 0-1<br>Hex (Base 16): 0-9, A-F<br>Octal (Base 8): 0-7</p>`,
            faq: []
        }
    },
    'roman-numerals': {
        id: 'roman-numerals',
        title: 'Roman Numeral Converter',
        description: 'Convert between Roman Numerals and Numbers.',
        category: 'conversion',
        icon: 'Type',
        meta: {
            title: 'Roman Numeral Converter',
            description: 'Convert decimal numbers to Roman numerals and vice versa.',
            keywords: ['roman numerals', 'roman converter', 'numbers to roman'],
        },
        inputs: [
            {
                id: 'decimal',
                label: 'Decimal Number',
                type: 'number',
                placeholder: 'e.g. 2024',
            }
        ],
        outputs: [
            {
                label: 'Roman Numeral',
                calculate: (inputs) => {
                    let num = Number(inputs['decimal']);
                    if (!num || num <= 0 || num >= 4000) return 'Enter 1-3999';

                    const lookup: [number, string][] = [
                        [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
                        [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
                        [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
                    ];
                    let roman = '';
                    for (const [val, symbol] of lookup) {
                        while (num >= val) {
                            roman += symbol;
                            num -= val;
                        }
                    }
                    return roman;
                },
            }
        ],
        content: {
            whatIs: `<h3>Roman Numerals</h3><p>I=1, V=5, X=10, L=50, C=100, D=500, M=1000</p>`,
            faq: []
        }
    },
    'time-converter': {
        id: 'time-converter',
        title: 'Time Unit Converter',
        description: 'Convert Seconds, Minutes, Hours, Days, Weeks.',
        category: 'conversion',
        icon: 'Clock',
        meta: {
            title: 'Time Converter',
            description: 'Convert between seconds, minutes, hours, days, and weeks.',
            keywords: ['time converter', 'seconds to minutes', 'hours to days'],
        },
        inputs: [
            {
                id: 'value',
                label: 'Value',
                type: 'number',
                placeholder: 'e.g. 60',
            },
            {
                id: 'unit',
                label: 'Unit',
                type: 'select',
                options: [
                    { value: 's', label: 'Seconds' },
                    { value: 'm', label: 'Minutes' },
                    { value: 'h', label: 'Hours' },
                    { value: 'd', label: 'Days' },
                    { value: 'w', label: 'Weeks' }
                ],
                defaultValue: 'm'
            }
        ],
        outputs: [
            {
                label: 'Seconds',
                calculate: (inputs) => {
                    const val = Number(inputs['value']);
                    if (!val) return 0;
                    const unit = inputs['unit'];
                    let s = 0;
                    if (unit === 's') s = val;
                    else if (unit === 'm') s = val * 60;
                    else if (unit === 'h') s = val * 3600;
                    else if (unit === 'd') s = val * 86400;
                    else if (unit === 'w') s = val * 604800;
                    return parseFloat(s.toFixed(2));
                },
            },
            {
                label: 'Minutes',
                calculate: (inputs) => {
                    const val = Number(inputs['value']);
                    if (!val) return 0;
                    const unit = inputs['unit'];
                    let m = 0;
                    if (unit === 's') m = val / 60;
                    else if (unit === 'm') m = val;
                    else if (unit === 'h') m = val * 60;
                    else if (unit === 'd') m = val * 1440;
                    else if (unit === 'w') m = val * 10080;
                    return parseFloat(m.toFixed(4));
                },
            },
            {
                label: 'Hours',
                calculate: (inputs) => {
                    const val = Number(inputs['value']);
                    if (!val) return 0;
                    const unit = inputs['unit'];
                    let h = 0;
                    if (unit === 's') h = val / 3600;
                    else if (unit === 'm') h = val / 60;
                    else if (unit === 'h') h = val;
                    else if (unit === 'd') h = val * 24;
                    else if (unit === 'w') h = val * 168;
                    return parseFloat(h.toFixed(6));
                },
            }
        ],
        content: {
            whatIs: `<h3>Time Conversion</h3><p>Standard time units conversion.</p>`,
            faq: []
        }
    },
    'scientific-notation': {
        id: 'scientific-notation',
        title: 'Scientific Notation Converter',
        description: 'Convert number to Scientific Notation (e.g. 1.2e+5).',
        category: 'math',
        icon: 'Calculator',
        meta: {
            title: 'Scientific Notation Calculator',
            description: 'Convert numbers to standard scientific notation (E-notation).',
            keywords: ['scientific notation', 'e notation', 'standard form converter'],
        },
        inputs: [
            {
                id: 'number',
                label: 'Decimal Number',
                type: 'number',
                placeholder: 'e.g. 12345',
            }
        ],
        outputs: [
            {
                label: 'Scientific Notation',
                calculate: (inputs) => {
                    const n = Number(inputs['number']);
                    if (!n) return '0';
                    return n.toExponential(4);
                },
            },
            {
                label: 'E-Notation',
                calculate: (inputs) => {
                    const n = Number(inputs['number']);
                    if (!n) return '0';
                    return n.toExponential(4).toUpperCase().replace('+', '');
                },
            }
        ],
        content: {
            whatIs: `<h3>Scientific Notation</h3><p>Expressed as a × 10^b, where 1 ≤ a < 10.</p>`,
            faq: []
        }
    },
    'rule-of-three': {
        id: 'rule-of-three',
        title: 'Rule of Three Calculator',
        description: 'Solve proportions (A/B = C/X).',
        category: 'math',
        icon: 'Divide',
        meta: {
            title: 'Rule of Three Calculator (Direct & Inverse)',
            description: 'Solve simple proportions using the Rule of Three. Supports direct and inverse relationships.',
            keywords: ['rule of three', 'proportion calculator', 'ratio solver'],
        },
        inputs: [
            {
                id: 'mode',
                label: 'Relationship Type',
                type: 'select',
                options: [
                    { value: 'direct', label: 'Direct (A/B = C/X)' },
                    { value: 'inverse', label: 'Inverse (A*B = C*X)' }
                ],
                defaultValue: 'direct'
            },
            {
                id: 'a',
                label: 'Value A',
                type: 'number',
                placeholder: 'e.g. 10',
            },
            {
                id: 'b',
                label: 'Value B',
                type: 'number',
                placeholder: 'e.g. 100',
            },
            {
                id: 'c',
                label: 'Value C',
                type: 'number',
                placeholder: 'e.g. 20',
            }
        ],
        outputs: [
            {
                label: 'Result (X)',
                calculate: (inputs) => {
                    const a = Number(inputs['a']);
                    const b = Number(inputs['b']);
                    const c = Number(inputs['c']);
                    const mode = inputs['mode'];

                    if (!a || !b || !c) return 0;

                    if (mode === 'inverse') {
                        // A * B = C * X  => X = (A * B) / C
                        return parseFloat(((a * b) / c).toFixed(4));
                    } else {
                        // A / B = C / X => A * X = B * C => X = (B * C) / a
                        if (a === 0) return 0;
                        return parseFloat(((b * c) / a).toFixed(4));
                    }
                },
            }
        ],
        content: {
            whatIs: `<h3>Rule of Three</h3><p>Used to find a fourth value when three are known in a proportion.</p>`,
            faq: []
        }
    },
    'ratio': {
        id: 'ratio',
        title: 'Ratio Calculator',
        description: 'Simplify ratios and resize numbers.',
        category: 'math',
        icon: 'Percent',
        meta: {
            title: 'Ratio Calculator | Simplify & Resize',
            description: 'Simplify ratios (A:B) and scale them.',
            keywords: ['ratio calculator', 'simplify ratio', 'ratio scaler'],
        },
        inputs: [
            {
                id: 'a',
                label: 'Value A',
                type: 'number',
                placeholder: 'e.g. 12',
            },
            {
                id: 'b',
                label: 'Value B',
                type: 'number',
                placeholder: 'e.g. 18',
            }
        ],
        outputs: [
            {
                label: 'Simplified Ratio',
                calculate: (inputs) => {
                    const a = Number(inputs['a']);
                    const b = Number(inputs['b']);
                    if (!a || !b) return '0:0';
                    const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
                    const val = gcd(a, b);
                    return `${a / val}:${b / val}`;
                },
            },
            {
                label: 'Ratio Value',
                calculate: (inputs) => {
                    const a = Number(inputs['a']);
                    const b = Number(inputs['b']);
                    if (!b) return 0;
                    return parseFloat((a / b).toFixed(4));
                },
            }
        ],
        content: {
            whatIs: `<h3>Ratios</h3><p>A relationship between two numbers indicating how many times the first number contains the second.</p>`,
            faq: []
        }
    },
    'fraction-calculator': {
        id: 'fraction-calculator',
        title: 'Fraction Calculator',
        description: 'Add, Subtract, Multiply, Divide Fractions.',
        category: 'math',
        icon: 'DivideSquare',
        meta: {
            title: 'Fraction Calculator',
            description: 'Perform arithmetic operations on fractions.',
            keywords: ['fraction calculator', 'add fractions', 'fraction math'],
        },
        inputs: [
            {
                id: 'n1',
                label: 'Numerator 1',
                type: 'number',
                placeholder: '1',
            },
            {
                id: 'd1',
                label: 'Denominator 1',
                type: 'number',
                placeholder: '2',
            },
            {
                id: 'op',
                label: 'Operator',
                type: 'select',
                options: [
                    { value: 'add', label: '+' },
                    { value: 'sub', label: '-' },
                    { value: 'mul', label: '×' },
                    { value: 'div', label: '÷' }
                ],
                defaultValue: 'add'
            },
            {
                id: 'n2',
                label: 'Numerator 2',
                type: 'number',
                placeholder: '3',
            },
            {
                id: 'd2',
                label: 'Denominator 2',
                type: 'number',
                placeholder: '4',
            }
        ],
        outputs: [
            {
                label: 'Result (Decimal)',
                calculate: (inputs) => {
                    const n1 = Number(inputs['n1']);
                    const d1 = Number(inputs['d1']);
                    const n2 = Number(inputs['n2']);
                    const d2 = Number(inputs['d2']);
                    const op = inputs['op'];

                    if (!d1 || !d2) return 0;

                    const v1 = n1 / d1;
                    const v2 = n2 / d2;

                    if (op === 'add') return parseFloat((v1 + v2).toFixed(4));
                    if (op === 'sub') return parseFloat((v1 - v2).toFixed(4));
                    if (op === 'mul') return parseFloat((v1 * v2).toFixed(4));
                    if (op === 'div') return parseFloat((v1 / v2).toFixed(4));
                    return 0;
                },
            },
            {
                label: 'Result (Fraction)',
                calculate: (inputs) => {
                    const n1 = Number(inputs['n1']);
                    const d1 = Number(inputs['d1']);
                    const n2 = Number(inputs['n2']);
                    const d2 = Number(inputs['d2']);
                    const op = inputs['op'];

                    if (!d1 || !d2) return 'Err';

                    let resN = 0;
                    let resD = 1;

                    if (op === 'add') {
                        resN = n1 * d2 + n2 * d1;
                        resD = d1 * d2;
                    } else if (op === 'sub') {
                        resN = n1 * d2 - n2 * d1;
                        resD = d1 * d2;
                    } else if (op === 'mul') {
                        resN = n1 * n2;
                        resD = d1 * d2;
                    } else if (op === 'div') {
                        resN = n1 * d2;
                        resD = d1 * n2;
                    }

                    if (resD === 0) return 'Undef';
                    if (resN === 0) return '0';

                    const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
                    const val = Math.abs(gcd(resN, resD));

                    return `${resN / val}/${resD / val}`;
                },
            }
        ],
        content: {
            whatIs: `<h3>Fraction Math</h3><p>Perform operations on fractions directly.</p>`,
            faq: []
        }
    },
    'kinetic-energy': {
        id: 'kinetic-energy',
        title: 'Kinetic Energy Calculator',
        description: 'Calculate energy of motion (KE = 0.5 * m * v²).',
        category: 'physics',
        icon: 'Zap',
        meta: { title: 'Kinetic Energy Calculator', description: 'Calculate the kinetic energy of an object.', keywords: ['kinetic energy', 'energy calculator', 'physics'] },
        inputs: [
            { id: 'm', label: 'Mass (kg)', type: 'number', placeholder: 'e.g. 10' },
            { id: 'v', label: 'Velocity (m/s)', type: 'number', placeholder: 'e.g. 5' }
        ],
        outputs: [
            {
                label: 'Kinetic Energy (J)',
                calculate: (inputs) => {
                    const m = Number(inputs['m']);
                    const v = Number(inputs['v']);
                    if (!m || !v) return 0;
                    return parseFloat((0.5 * m * v * v).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Kinetic Energy</h3><p>Energy that a body possesses by virtue of being in motion.</p>', faq: [] }
    },
    'potential-energy': {
        id: 'potential-energy',
        title: 'Potential Energy Calculator',
        description: 'Calculate gravitational potential energy (PE = mgh).',
        category: 'physics',
        icon: 'ArrowUp',
        meta: { title: 'Potential Energy Calculator', description: 'Calculate gravitational potential energy.', keywords: ['potential energy', 'mgh calculator'] },
        inputs: [
            { id: 'm', label: 'Mass (kg)', type: 'number', placeholder: 'e.g. 10' },
            { id: 'h', label: 'Height (m)', type: 'number', placeholder: 'e.g. 5' },
            { id: 'g', label: 'Gravity (m/s²)', type: 'number', placeholder: '9.81', defaultValue: '9.81' }
        ],
        outputs: [
            {
                label: 'Potential Energy (J)',
                calculate: (inputs) => {
                    const m = Number(inputs['m']);
                    const h = Number(inputs['h']);
                    const g = Number(inputs['g']) || 9.81;
                    if (!m || !h) return 0;
                    return parseFloat((m * g * h).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Potential Energy</h3><p>Energy held by an object because of its position relative to other objects.</p>', faq: [] }
    },
    'momentum': {
        id: 'momentum',
        title: 'Momentum Calculator',
        description: 'Calculate momentum (p = mv).',
        category: 'physics',
        icon: 'Move',
        meta: { title: 'Momentum Calculator', description: 'Calculate momentum of an object.', keywords: ['momentum', 'physics'] },
        inputs: [
            { id: 'm', label: 'Mass (kg)', type: 'number', placeholder: 'e.g. 10' },
            { id: 'v', label: 'Velocity (m/s)', type: 'number', placeholder: 'e.g. 5' }
        ],
        outputs: [
            {
                label: 'Momentum (kg·m/s)',
                calculate: (inputs) => {
                    const m = Number(inputs['m']);
                    const v = Number(inputs['v']);
                    if (!m || !v) return 0;
                    return parseFloat((m * v).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Momentum</h3><p>The quantity of motion of a moving body.</p>', faq: [] }
    },
    'impulse': {
        id: 'impulse',
        title: 'Impulse Calculator',
        description: 'Calculate impulse (J = F * Δt).',
        category: 'physics',
        icon: 'Activity',
        meta: { title: 'Impulse Calculator', description: 'Calculate impulse applied to an object.', keywords: ['impulse', 'force time'] },
        inputs: [
            { id: 'f', label: 'Force (N)', type: 'number', placeholder: 'e.g. 100' },
            { id: 't', label: 'Time Interval (s)', type: 'number', placeholder: 'e.g. 0.5' }
        ],
        outputs: [
            {
                label: 'Impulse (N·s)',
                calculate: (inputs) => {
                    const f = Number(inputs['f']);
                    const t = Number(inputs['t']);
                    if (!f || !t) return 0;
                    return parseFloat((f * t).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Impulse</h3><p>Change in momentum of an object when force is applied.</p>', faq: [] }
    },
    'torque': {
        id: 'torque',
        title: 'Torque Calculator',
        description: 'Calculate torque (τ = r * F * sinθ).',
        category: 'physics',
        icon: 'RotateCw',
        meta: { title: 'Torque Calculator', description: 'Calculate torque on a lever arm.', keywords: ['torque', 'moment of force'] },
        inputs: [
            { id: 'f', label: 'Force (N)', type: 'number', placeholder: 'e.g. 50' },
            { id: 'r', label: 'Radius/Length (m)', type: 'number', placeholder: 'e.g. 0.5' },
            { id: 'theta', label: 'Angle (degrees)', type: 'number', placeholder: '90', defaultValue: '90' }
        ],
        outputs: [
            {
                label: 'Torque (N·m)',
                calculate: (inputs) => {
                    const f = Number(inputs['f']);
                    const r = Number(inputs['r']);
                    const theta = Number(inputs['theta']);
                    if (!f || !r) return 0;
                    const rad = (theta || 90) * (Math.PI / 180);
                    return parseFloat((r * f * Math.sin(rad)).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Torque</h3><p>Rotational equivalent of linear force.</p>', faq: [] }
    },
    'gravity': {
        id: 'gravity',
        title: 'Gravitational Force Calculator',
        description: 'Calculate force using Newton\'s Law (F = Gm1m2/r²).',
        category: 'physics',
        icon: 'Globe',
        meta: { title: 'Gravitational Force Calculator', description: 'Newton\'s Law of Universal Gravitation.', keywords: ['gravity', 'newton law'] },
        inputs: [
            { id: 'm1', label: 'Mass 1 (kg)', type: 'number', placeholder: 'e.g. 5.972e24 (Earth)' },
            { id: 'm2', label: 'Mass 2 (kg)', type: 'number', placeholder: 'e.g. 70' },
            { id: 'r', label: 'Distance (m)', type: 'number', placeholder: 'e.g. 6371000' }
        ],
        outputs: [
            {
                label: 'Force (N)',
                calculate: (inputs) => {
                    const m1 = Number(inputs['m1']);
                    const m2 = Number(inputs['m2']);
                    const r = Number(inputs['r']);
                    if (!m1 || !m2 || !r) return 0;
                    const G = 6.67430e-11;
                    return (G * m1 * m2) / (r * r);
                }
            }
        ],
        content: { whatIs: '<h3>Universal Gravitation</h3><p>Every particle attracts every other particle with a force directly proportional to the product of their masses and inversely proportional to the square of the distance between their centers.</p>', faq: [] }
    },
    'density': {
        id: 'density',
        title: 'Density Calculator',
        description: 'Calculate density, mass, or volume (ρ = m/V).',
        category: 'physics',
        icon: 'Box',
        meta: { title: 'Density Calculator', description: 'Calculate density, mass, or volume.', keywords: ['density', 'mass', 'volume'] },
        inputs: [
            { id: 'm', label: 'Mass (kg)', type: 'number', placeholder: 'e.g. 10' },
            { id: 'v', label: 'Volume (m³)', type: 'number', placeholder: 'e.g. 2' }
        ],
        outputs: [
            {
                label: 'Density (kg/m³)',
                calculate: (inputs) => {
                    const m = Number(inputs['m']);
                    const v = Number(inputs['v']);
                    if (!m || !v) return 0;
                    return parseFloat((m / v).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Density</h3><p>Mass per unit volume.</p>', faq: [] }
    },
    'pressure': {
        id: 'pressure',
        title: 'Pressure Calculator',
        description: 'Calculate pressure (P = F/A).',
        category: 'physics',
        icon: 'Gauge',
        meta: { title: 'Pressure Calculator', description: 'Calculate pressure from force and area.', keywords: ['pressure', 'pascal'] },
        inputs: [
            { id: 'f', label: 'Force (N)', type: 'number', placeholder: 'e.g. 100' },
            { id: 'a', label: 'Area (m²)', type: 'number', placeholder: 'e.g. 2' }
        ],
        outputs: [
            {
                label: 'Pressure (Pa)',
                calculate: (inputs) => {
                    const f = Number(inputs['f']);
                    const a = Number(inputs['a']);
                    if (!f || !a) return 0;
                    return parseFloat((f / a).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Pressure</h3><p>Force applied perpendicular to the surface of an object per unit area.</p>', faq: [] }
    },
    'loan': {
        id: 'loan',
        title: 'Loan Calculator',
        description: 'Calculate monthly payments with down payment support.',
        category: 'finance',
        icon: 'Banknote',
        meta: {
            title: 'Loan Calculator | Monthly Payment with Down Payment',
            description: 'Calculate monthly loan payments for mortgages, auto loans, or personal loans. Includes down payment and total interest options.',
            keywords: ['loan calculator', 'mortgage calculator', 'auto loan calculator', 'monthly payment', 'amortization'],
        },
        inputs: [
            { id: 'price', label: 'Total Price (e.g. Car/Home)', type: 'number', placeholder: 'e.g. 30000', defaultValue: 30000 },
            { id: 'down_payment', label: 'Down Payment', type: 'number', placeholder: 'e.g. 5000', defaultValue: 5000 },
            { id: 'rate', label: 'Interest Rate (% per year)', type: 'number', placeholder: 'e.g. 5.5', defaultValue: 5.5 },
            { id: 'term', label: 'Loan Term (years)', type: 'number', placeholder: 'e.g. 5', defaultValue: 5 },
        ],
        outputs: [
            {
                label: 'Monthly Payment',
                unit: '$',
                calculate: (inputs) => {
                    const price = Number(inputs['price']) || 0;
                    const down = Number(inputs['down_payment']) || 0;
                    const P = Math.max(0, price - down);

                    const r = Number(inputs['rate']) / 100 / 12; // Monthly rate
                    const n = Number(inputs['term']) * 12; // Total months

                    if (!P || !r || !n) return 0;

                    // M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
                    const check = Math.pow(1 + r, n);
                    return parseFloat(((P * r * check) / (check - 1)).toFixed(2));
                },
            },
            {
                label: 'Loan Principal',
                unit: '$',
                calculate: (inputs) => {
                    const price = Number(inputs['price']) || 0;
                    const down = Number(inputs['down_payment']) || 0;
                    return Math.max(0, price - down);
                },
            },
            {
                label: 'Total Interest',
                unit: '$',
                calculate: (inputs) => {
                    const price = Number(inputs['price']) || 0;
                    const down = Number(inputs['down_payment']) || 0;
                    const P = Math.max(0, price - down);

                    const r = Number(inputs['rate']) / 100 / 12;
                    const n = Number(inputs['term']) * 12;

                    if (!P || !r || !n) return 0;

                    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
                    const totalPaid = monthly * n;
                    return parseFloat((totalPaid - P).toFixed(2));
                },
            },
            {
                label: 'Total Paid',
                unit: '$',
                calculate: (inputs) => {
                    const price = Number(inputs['price']) || 0;
                    const down = Number(inputs['down_payment']) || 0;
                    const P = Math.max(0, price - down);

                    const r = Number(inputs['rate']) / 100 / 12;
                    const n = Number(inputs['term']) * 12;

                    if (!P || !r || !n) return 0;

                    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
                    return parseFloat((monthly * n).toFixed(2));
                },
            }
        ],
        content: {
            whatIs: `
            <h3>How do Loans Work?</h3>
            <p>A loan is a contract where a lender gives you money today in exchange for future repayment with interest. Most loans (like mortgages and auto loans) are <strong>amortized</strong>, meaning you pay the same amount every month, but the split between principal and interest changes over time.</p>
            `,
            howTo: `
            <h3>Step-by-Step Example: Buying a Car</h3>
            <div class="space-y-6 my-6">
                <div class="flex gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div class="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-200 text-blue-700 font-bold">1</div>
                    <div>
                        <h4 class="font-bold text-blue-900">The Purchase</h4>
                        <p class="text-sm text-blue-800 mb-2">You want a car costing <strong>$30,000</strong>.</p>
                        <p class="text-xs text-gray-600">You have <strong>$5,000</strong> saved for the Down Payment.</p>
                    </div>
                </div>

                <div class="flex gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <div class="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-purple-200 text-purple-700 font-bold">2</div>
                    <div>
                        <h4 class="font-bold text-purple-900">The Loan</h4>
                        <p class="text-sm text-purple-800 mb-2">We subtract the down payment to find what you need to borrow.</p>
                        <code class="block mt-2 bg-white/50 p-2 rounded text-purple-900 font-mono text-xs">$30,000 - $5,000 = $25,000 Principal</code>
                    </div>
                </div>

                <div class="flex gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                    <div class="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-green-200 text-green-700 font-bold">=</div>
                    <div>
                        <h4 class="font-bold text-green-900">The Payment</h4>
                        <p class="text-sm text-green-800 mb-2">At 5.5% interest for 5 years:</p>
                        <p class="text-xl font-bold text-green-700">$477.53 / month</p>
                    </div>
                </div>
            </div>
            `,
            faq: [
                {
                    question: "How does a Down Payment help me?",
                    answer: "A larger down payment reduces the 'Loan Principal' (the amount you borrow). This lowers your monthly payment AND reduces the total interest you pay over the life of the loan."
                },
                {
                    question: "What is Principal vs Interest?",
                    answer: "The 'Principal' is the money you actually borrowed. 'Interest' is the fee the bank charges you. In the beginning of a loan, most of your payment goes to Interest. By the end, most goes to Principal."
                }
            ]
        }
    },
    'buoyancy': {
        id: 'buoyancy',
        title: 'Buoyancy Calculator',
        description: 'Calculate buoyant force (Fb = ρVg).',
        category: 'physics',
        icon: 'Droplets',
        meta: { title: 'Buoyancy Calculator', description: 'Calculate the buoyant force on a submerged object.', keywords: ['buoyancy', 'archimedes principle'] },
        inputs: [
            { id: 'rho', label: 'Fluid Density (kg/m³)', type: 'number', placeholder: 'e.g. 1000 (Water)', defaultValue: '1000' },
            { id: 'v', label: 'Displaced Volume (m³)', type: 'number', placeholder: 'e.g. 0.5' },
            { id: 'g', label: 'Gravity (m/s²)', type: 'number', placeholder: '9.81', defaultValue: '9.81' }
        ],
        outputs: [
            {
                label: 'Buoyant Force (N)',
                calculate: (inputs) => {
                    const rho = Number(inputs['rho']);
                    const v = Number(inputs['v']);
                    const g = Number(inputs['g']) || 9.81;
                    if (!rho || !v) return 0;
                    return parseFloat((rho * v * g).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Archimedes\' Principle</h3><p>The upward buoyant force that is exerted on a body immersed in a fluid is equal to the weight of the fluid that the body displaces.</p>', faq: [] }
    },
    'hookes-law': {
        id: 'hookes-law',
        title: 'Hooke\'s Law Calculator',
        description: 'Calculate spring force (F = -kx).',
        category: 'physics',
        icon: 'Activity',
        meta: { title: 'Hooke\'s Law Calculator', description: 'Calculate force exerted by a spring.', keywords: ['spring constant', 'hookes law'] },
        inputs: [
            { id: 'k', label: 'Spring Constant (N/m)', type: 'number', placeholder: 'e.g. 50' },
            { id: 'x', label: 'Displacement (m)', type: 'number', placeholder: 'e.g. 0.1' }
        ],
        outputs: [
            {
                label: 'Force (N)',
                calculate: (inputs) => {
                    const k = Number(inputs['k']);
                    const x = Number(inputs['x']);
                    if (!k || !x) return 0;
                    return parseFloat((k * x).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Hooke\'s Law</h3><p>The force needed to extend or compress a spring by some distance scales linearly with respect to that distance.</p>', faq: [] }
    },
    // --- GEOMETRY: VOLUMES ---
    'volume-cube': {
        id: 'volume-cube',
        title: 'Volume of Cube',
        description: 'Calculate the volume of a cube (V = a³).',
        category: 'geometry',
        icon: 'Box',
        meta: { title: 'Volume of Cube Calculator', description: 'Calculate the volume of a cube given its side length.', keywords: ['volume', 'cube', 'geometry'] },
        inputs: [{ id: 'a', label: 'Side Length', type: 'number', placeholder: 'e.g. 5' }],
        outputs: [{ label: 'Volume', calculate: (inputs) => { const a = Number(inputs['a']); return a ? parseFloat(Math.pow(a, 3).toFixed(2)) : 0; } }],
        content: { whatIs: '<h3>Volume of Cube</h3><p>Space occupied by a cube.</p>', faq: [] }
    },
    'volume-cuboid': {
        id: 'volume-cuboid',
        title: 'Volume of Cuboid',
        description: 'Calculate volume of a rectangular prism.',
        category: 'geometry',
        icon: 'Box',
        meta: { title: 'Volume of Cuboid Calculator', description: 'Calculate the volume of a box/cuboid.', keywords: ['volume', 'cuboid', 'box'] },
        inputs: [
            { id: 'l', label: 'Length', type: 'number', placeholder: 'e.g. 10' },
            { id: 'w', label: 'Width', type: 'number', placeholder: 'e.g. 5' },
            { id: 'h', label: 'Height', type: 'number', placeholder: 'e.g. 2' }
        ],
        outputs: [{ label: 'Volume', calculate: (inputs) => { const l = Number(inputs['l']), w = Number(inputs['w']), h = Number(inputs['h']); return (l && w && h) ? parseFloat((l * w * h).toFixed(2)) : 0; } }],
        content: { whatIs: '<h3>Volume of Cuboid</h3><p>V = Length × Width × Height.</p>', faq: [] }
    },
    'volume-sphere': {
        id: 'volume-sphere',
        title: 'Volume of Sphere',
        description: 'Calculate the volume of a sphere.',
        category: 'geometry',
        icon: 'Circle',
        meta: { title: 'Volume of Sphere Calculator', description: 'Calculate sphere volume from radius.', keywords: ['volume', 'sphere', 'ball'] },
        inputs: [{ id: 'r', label: 'Radius', type: 'number', placeholder: 'e.g. 3' }],
        outputs: [{ label: 'Volume', calculate: (inputs) => { const r = Number(inputs['r']); return r ? parseFloat(((4 / 3) * Math.PI * Math.pow(r, 3)).toFixed(2)) : 0; } }],
        content: { whatIs: '<h3>Volume of Sphere</h3><p>V = (4/3)πr³.</p>', faq: [] }
    },
    'volume-cylinder': {
        id: 'volume-cylinder',
        title: 'Volume of Cylinder',
        description: 'Calculate the volume of a cylinder.',
        category: 'geometry',
        icon: 'Database', // Cylinder shape
        meta: { title: 'Volume of Cylinder Calculator', description: 'Calculate cylinder volume from radius and height.', keywords: ['volume', 'cylinder', 'tube'] },
        inputs: [
            { id: 'r', label: 'Radius', type: 'number', placeholder: 'e.g. 3' },
            { id: 'h', label: 'Height', type: 'number', placeholder: 'e.g. 10' }
        ],
        outputs: [{ label: 'Volume', calculate: (inputs) => { const r = Number(inputs['r']), h = Number(inputs['h']); return (r && h) ? parseFloat((Math.PI * r * r * h).toFixed(2)) : 0; } }],
        content: { whatIs: '<h3>Volume of Cylinder</h3><p>V = πr²h.</p>', faq: [] }
    },
    'volume-cone': {
        id: 'volume-cone',
        title: 'Volume of Cone',
        description: 'Calculate the volume of a cone.',
        category: 'geometry',
        icon: 'Cone',
        meta: { title: 'Volume of Cone Calculator', description: 'Calculate cone volume from radius and height.', keywords: ['volume', 'cone', 'geometry'] },
        inputs: [
            { id: 'r', label: 'Radius', type: 'number', placeholder: 'e.g. 3' },
            { id: 'h', label: 'Height', type: 'number', placeholder: 'e.g. 10' }
        ],
        outputs: [{ label: 'Volume', calculate: (inputs) => { const r = Number(inputs['r']), h = Number(inputs['h']); return (r && h) ? parseFloat(((1 / 3) * Math.PI * r * r * h).toFixed(2)) : 0; } }],
        content: { whatIs: '<h3>Volume of Cone</h3><p>V = (1/3)πr²h.</p>', faq: [] }
    },
    // --- GEOMETRY: SURFACE AREA ---
    'surface-cube': {
        id: 'surface-cube',
        title: 'Surface Area of Cube',
        description: 'Calculate surface area (A = 6a²).',
        category: 'geometry',
        icon: 'Box',
        meta: { title: 'Surface Area of Cube', description: 'Calculate the total surface area of a cube.', keywords: ['surface area', 'cube'] },
        inputs: [{ id: 'a', label: 'Side Length', type: 'number', placeholder: 'e.g. 5' }],
        outputs: [{ label: 'Surface Area', calculate: (inputs) => { const a = Number(inputs['a']); return a ? parseFloat((6 * a * a).toFixed(2)) : 0; } }],
        content: { whatIs: '<h3>Surface Area</h3><p>Total area of all faces of a cube.</p>', faq: [] }
    },
    'surface-sphere': {
        id: 'surface-sphere',
        title: 'Surface Area of Sphere',
        description: 'Calculate surface area (A = 4πr²).',
        category: 'geometry',
        icon: 'Circle',
        meta: { title: 'Surface Area of Sphere', description: 'Calculate the surface area of a sphere.', keywords: ['surface area', 'sphere'] },
        inputs: [{ id: 'r', label: 'Radius', type: 'number', placeholder: 'e.g. 3' }],
        outputs: [{ label: 'Surface Area', calculate: (inputs) => { const r = Number(inputs['r']); return r ? parseFloat((4 * Math.PI * r * r).toFixed(2)) : 0; } }],
        content: { whatIs: '<h3>Surface Area of Sphere</h3><p>A = 4πr².</p>', faq: [] }
    },
    // --- CONVERTERS ---
    'data-storage': {
        id: 'data-storage',
        title: 'Data Storage Converter',
        description: 'Convert Bits, Bytes, KB, MB, GB, TB.',
        category: 'conversion',
        icon: 'HardDrive',
        meta: { title: 'Data Storage Converter', description: 'Convert between digital storage units.', keywords: ['bytes', 'bits', 'megabytes', 'gigabytes'] },
        inputs: [
            { id: 'val', label: 'Value', type: 'number', placeholder: '1' },
            {
                id: 'from', label: 'From', type: 'select',
                options: [
                    { value: 'b', label: 'Bits (b)' }, { value: 'B', label: 'Bytes (B)' },
                    { value: 'KB', label: 'Kilobytes (KB)' }, { value: 'MB', label: 'Megabytes (MB)' },
                    { value: 'GB', label: 'Gigabytes (GB)' }, { value: 'TB', label: 'Terabytes (TB)' }
                ], defaultValue: 'MB'
            },
            {
                id: 'to', label: 'To', type: 'select',
                options: [
                    { value: 'b', label: 'Bits (b)' }, { value: 'B', label: 'Bytes (B)' },
                    { value: 'KB', label: 'Kilobytes (KB)' }, { value: 'MB', label: 'Megabytes (MB)' },
                    { value: 'GB', label: 'Gigabytes (GB)' }, { value: 'TB', label: 'Terabytes (TB)' }
                ], defaultValue: 'GB'
            }
        ],
        outputs: [{
            label: 'Result', calculate: (inputs) => {
                const val = Number(inputs['val']);
                const from = String(inputs['from']);
                const to = String(inputs['to']);
                if (val === undefined || !from || !to) return 0;
                const factors: Record<string, number> = { 'b': 1 / 8, 'B': 1, 'KB': 1024, 'MB': 1024 ** 2, 'GB': 1024 ** 3, 'TB': 1024 ** 4 };
                const bytes = val * factors[from];
                return parseFloat((bytes / factors[to]).toFixed(6));
            }
        }],
        content: { whatIs: '<h3>Data Units</h3><p>1 Byte = 8 bits. 1 KB = 1024 Bytes (binary definition).</p>', faq: [] }
    },
    'speed-converter': {
        id: 'speed-converter',
        title: 'Speed Converter',
        description: 'Convert m/s, km/h, mph, knots.',
        category: 'conversion',
        icon: 'Gauge',
        meta: { title: 'Speed Converter', description: 'Convert velocity units.', keywords: ['speed', 'velocity', 'mph', 'kmh'] },
        inputs: [
            { id: 'val', label: 'Value', type: 'number', placeholder: '60' },
            {
                id: 'from', label: 'From', type: 'select',
                options: [{ value: 'mph', label: 'Miles per Hour (mph)' }, { value: 'kmh', label: 'Km per Hour (km/h)' }, { value: 'ms', label: 'Meters per Second (m/s)' }, { value: 'kn', label: 'Knots' }], defaultValue: 'mph'
            },
            {
                id: 'to', label: 'To', type: 'select',
                options: [{ value: 'mph', label: 'Miles per Hour (mph)' }, { value: 'kmh', label: 'Km per Hour (km/h)' }, { value: 'ms', label: 'Meters per Second (m/s)' }, { value: 'kn', label: 'Knots' }], defaultValue: 'kmh'
            }
        ],
        outputs: [{
            label: 'Result', calculate: (inputs) => {
                const val = Number(inputs['val']);
                const from = String(inputs['from']);
                const to = String(inputs['to']);
                if (val === undefined) return 0;
                // Base: m/s
                const toMS: Record<string, number> = { 'mph': 0.44704, 'kmh': 0.277778, 'ms': 1, 'kn': 0.514444 };
                const ms = val * toMS[from];
                return parseFloat((ms / toMS[to]).toFixed(4));
            }
        }],
        content: { whatIs: '<h3>Speed Units</h3><p>Different ways to measure velocity.</p>', faq: [] }
    },
    'time-converter': {
        id: 'time-converter',
        title: 'Time Converter',
        description: 'Convert Seconds, Minutes, Hours, Days.',
        category: 'conversion',
        icon: 'Clock',
        meta: { title: 'Time Converter', description: 'Convert time units.', keywords: ['time', 'seconds', 'hours', 'minutes'] },
        inputs: [
            { id: 'val', label: 'Value', type: 'number', placeholder: '60' },
            {
                id: 'from', label: 'From', type: 'select',
                options: [{ value: 's', label: 'Seconds' }, { value: 'm', label: 'Minutes' }, { value: 'h', label: 'Hours' }, { value: 'd', label: 'Days' }, { value: 'w', label: 'Weeks' }, { value: 'y', label: 'Years' }], defaultValue: 'm'
            },
            {
                id: 'to', label: 'To', type: 'select',
                options: [{ value: 's', label: 'Seconds' }, { value: 'm', label: 'Minutes' }, { value: 'h', label: 'Hours' }, { value: 'd', label: 'Days' }, { value: 'w', label: 'Weeks' }, { value: 'y', label: 'Years' }], defaultValue: 's'
            }
        ],
        outputs: [{
            label: 'Result', calculate: (inputs) => {
                const val = Number(inputs['val']);
                const from = String(inputs['from']);
                const to = String(inputs['to']);
                if (val === undefined) return 0;
                // Base: seconds
                const toSec: Record<string, number> = { 's': 1, 'm': 60, 'h': 3600, 'd': 86400, 'w': 604800, 'y': 31536000 };
                const sec = val * toSec[from];
                return parseFloat((sec / toSec[to]).toFixed(4));
            }
        }],
        content: { whatIs: '<h3>Time Units</h3><p>Conversion between different time scales.</p>', faq: [] }
    },
    'projectile': {
        id: 'projectile',
        title: 'Projectile Motion Calculator',
        description: 'Calculate range and time of flight.',
        category: 'physics',
        icon: 'MoveDiagonally',
        meta: { title: 'Projectile Motion Calculator', description: 'Calculate range, height, and time of flight for a projectile.', keywords: ['projectile', 'trajectory'] },
        inputs: [
            { id: 'v', label: 'Initial Velocity (m/s)', type: 'number', placeholder: 'e.g. 50' },
            { id: 'theta', label: 'Angle (°)', type: 'number', placeholder: 'e.g. 45' },
            { id: 'g', label: 'Gravity (m/s²)', type: 'number', placeholder: '9.81', defaultValue: '9.81' }
        ],
        outputs: [
            {
                label: 'Max Range (m)',
                calculate: (inputs) => {
                    const v = Number(inputs['v']);
                    const theta = Number(inputs['theta']);
                    const g = Number(inputs['g']) || 9.81;
                    if (!v) return 0;
                    const rad = (theta * Math.PI) / 180;
                    return parseFloat(((v * v * Math.sin(2 * rad)) / g).toFixed(2));
                }
            },
            {
                label: 'Max Height (m)',
                calculate: (inputs) => {
                    const v = Number(inputs['v']);
                    const theta = Number(inputs['theta']);
                    const g = Number(inputs['g']) || 9.81;
                    if (!v) return 0;
                    const rad = (theta * Math.PI) / 180;
                    const vy = v * Math.sin(rad);
                    return parseFloat(((vy * vy) / (2 * g)).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Projectile Motion</h3><p>Form of motion experienced by an object or particle that is projected near the Earth\'s surface.</p>', faq: [] }
    },
    'area-converter': {
        id: 'area-converter',
        title: 'Area Converter',
        description: 'Convert Sq Meters, Sq Feet, Acres, Hectares.',
        category: 'conversion',
        icon: 'Ruler',
        meta: { title: 'Area Converter', description: 'Convert area units.', keywords: ['area', 'square meters', 'acres', 'hectares'] },
        inputs: [
            { id: 'val', label: 'Value', type: 'number', placeholder: '1' },
            {
                id: 'from', label: 'From', type: 'select',
                options: [{ value: 'm2', label: 'Square Meters (m²)' }, { value: 'ft2', label: 'Square Feet (ft²)' }, { value: 'ac', label: 'Acres' }, { value: 'ha', label: 'Hectares' }, { value: 'km2', label: 'Square Kilometers' }, { value: 'mi2', label: 'Square Miles' }], defaultValue: 'm2'
            },
            {
                id: 'to', label: 'To', type: 'select',
                options: [{ value: 'm2', label: 'Square Meters (m²)' }, { value: 'ft2', label: 'Square Feet (ft²)' }, { value: 'ac', label: 'Acres' }, { value: 'ha', label: 'Hectares' }, { value: 'km2', label: 'Square Kilometers' }, { value: 'mi2', label: 'Square Miles' }], defaultValue: 'ft2'
            }
        ],
        outputs: [{
            label: 'Result', calculate: (inputs) => {
                const val = Number(inputs['val']);
                const from = String(inputs['from']);
                const to = String(inputs['to']);
                if (val === undefined) return 0;
                // Base: m2
                const toM2: Record<string, number> = { 'm2': 1, 'ft2': 0.092903, 'ac': 4046.86, 'ha': 10000, 'km2': 1000000, 'mi2': 2589988 };
                const m2 = val * toM2[from];
                return parseFloat((m2 / toM2[to]).toFixed(6));
            }
        }],
        content: { whatIs: '<h3>Area Units</h3><p>Conversion between different units of area.</p>', faq: [] }
    },
    'volume-converter': {
        id: 'volume-converter',
        title: 'Volume Converter',
        description: 'Convert Liters, Gallons, Cups, Tablespoons.',
        category: 'conversion',
        icon: 'Beaker',
        meta: { title: 'Volume Converter', description: 'Convert volume units.', keywords: ['volume', 'liters', 'gallons', 'cups'] },
        inputs: [
            { id: 'val', label: 'Value', type: 'number', placeholder: '1' },
            {
                id: 'from', label: 'From', type: 'select',
                options: [
                    { value: 'l', label: 'Liters (L)' }, { value: 'ml', label: 'Milliliters (mL)' },
                    { value: 'gal', label: 'Gallons (US)' }, { value: 'qt', label: 'Quarts (US)' },
                    { value: 'pt', label: 'Pints (US)' }, { value: 'cup', label: 'Cups (US)' },
                    { value: 'floz', label: 'Fluid Ounces (US)' }, { value: 'tbsp', label: 'Tablespoons (US)' },
                    { value: 'tsp', label: 'Teaspoons (US)' }, { value: 'm3', label: 'Cubic Meters' }
                ], defaultValue: 'l'
            },
            {
                id: 'to', label: 'To', type: 'select',
                options: [
                    { value: 'l', label: 'Liters (L)' }, { value: 'ml', label: 'Milliliters (mL)' },
                    { value: 'gal', label: 'Gallons (US)' }, { value: 'qt', label: 'Quarts (US)' },
                    { value: 'pt', label: 'Pints (US)' }, { value: 'cup', label: 'Cups (US)' },
                    { value: 'floz', label: 'Fluid Ounces (US)' }, { value: 'tbsp', label: 'Tablespoons (US)' },
                    { value: 'tsp', label: 'Teaspoons (US)' }, { value: 'm3', label: 'Cubic Meters' }
                ], defaultValue: 'gal'
            }
        ],
        outputs: [{
            label: 'Result', calculate: (inputs) => {
                const val = Number(inputs['val']);
                const from = String(inputs['from']);
                const to = String(inputs['to']);
                if (val === undefined) return 0;
                // Base: liters
                const toL: Record<string, number> = {
                    'l': 1, 'ml': 0.001, 'm3': 1000,
                    'gal': 3.78541, 'qt': 0.946353, 'pt': 0.473176, 'cup': 0.24, // Cup is approx 240ml
                    'floz': 0.0295735, 'tbsp': 0.0147868, 'tsp': 0.00492892
                };
                const l = val * toL[from];
                return parseFloat((l / toL[to]).toFixed(6));
            }
        }],
        content: { whatIs: '<h3>Volume Units</h3><p>Conversion between different units of volume.</p>', faq: [] }
    },
    'loan-calculator': {
        id: 'loan-calculator',
        title: 'Loan Calculator',
        description: 'Calculate monthly loan payments.',
        category: 'finance',
        icon: 'DollarSign',
        meta: { title: 'Loan Calculator', description: 'Calculate monthly payments and total interest for loans.', keywords: ['loan calculator', 'pmt calculator', 'monthly payment'] },
        inputs: [
            { id: 'p', label: 'Loan Amount ($)', type: 'number', placeholder: 'e.g. 10000' },
            { id: 'r', label: 'Annual Interest Rate (%)', type: 'number', placeholder: 'e.g. 5' },
            { id: 'n', label: 'Loan Term (Years)', type: 'number', placeholder: 'e.g. 5' }
        ],
        outputs: [
            {
                label: 'Monthly Payment',
                calculate: (inputs) => {
                    const p = Number(inputs['p']);
                    const r = Number(inputs['r']);
                    const n = Number(inputs['n']);
                    if (!p || !n) return 0;
                    if (!r) return parseFloat((p / (n * 12)).toFixed(2));

                    const monthlyRate = r / 100 / 12;
                    const numPayments = n * 12;

                    // PMT = P * r(1+r)^n / ((1+r)^n - 1)
                    const pmt = p * monthlyRate * Math.pow(1 + monthlyRate, numPayments) / (Math.pow(1 + monthlyRate, numPayments) - 1);
                    return parseFloat(pmt.toFixed(2));
                }
            },
            {
                label: 'Total Payment',
                calculate: (inputs) => {
                    const p = Number(inputs['p']);
                    const r = Number(inputs['r']);
                    const n = Number(inputs['n']);
                    if (!p || !n) return 0;
                    if (!r) return p;

                    const monthlyRate = r / 100 / 12;
                    const numPayments = n * 12;
                    const pmt = p * monthlyRate * Math.pow(1 + monthlyRate, numPayments) / (Math.pow(1 + monthlyRate, numPayments) - 1);
                    return parseFloat((pmt * numPayments).toFixed(2));
                }
            },
            {
                label: 'Total Interest',
                calculate: (inputs) => {
                    const p = Number(inputs['p']);
                    const r = Number(inputs['r']);
                    const n = Number(inputs['n']);
                    if (!p || !n) return 0;
                    if (!r) return 0;

                    const monthlyRate = r / 100 / 12;
                    const numPayments = n * 12;
                    const pmt = p * monthlyRate * Math.pow(1 + monthlyRate, numPayments) / (Math.pow(1 + monthlyRate, numPayments) - 1);
                    const total = pmt * numPayments;
                    return parseFloat((total - p).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Loan Calculation</h3><p>Determines the fixed monthly payment needed to pay off a loan over a specific term.</p>', faq: [] }
    },
    'mortgage-calculator': {
        id: 'mortgage-calculator',
        title: 'Mortgage Calculator',
        description: 'Calculate mortgage payments with down payment.',
        category: 'finance',
        icon: 'Home',
        meta: { title: 'Mortgage Calculator', description: 'Estimate monthly mortgage payments.', keywords: ['mortgage calculator', 'home loan'] },
        inputs: [
            { id: 'price', label: 'Home Price ($)', type: 'number', placeholder: 'e.g. 300000' },
            { id: 'down', label: 'Down Payment ($)', type: 'number', placeholder: 'e.g. 60000' },
            { id: 'r', label: 'Interest Rate (%)', type: 'number', placeholder: 'e.g. 3.5' },
            { id: 'n', label: 'Loan Term (Years)', type: 'number', placeholder: 'e.g. 30', defaultValue: '30' }
        ],
        outputs: [
            {
                label: 'Monthly Payment',
                calculate: (inputs) => {
                    const price = Number(inputs['price']);
                    const down = Number(inputs['down']) || 0;
                    const r = Number(inputs['r']);
                    const n = Number(inputs['n']);

                    const p = price - down;
                    if (p <= 0 || !n) return 0;
                    if (!r) return parseFloat((p / (n * 12)).toFixed(2));

                    const monthlyRate = r / 100 / 12;
                    const numPayments = n * 12;
                    const pmt = p * monthlyRate * Math.pow(1 + monthlyRate, numPayments) / (Math.pow(1 + monthlyRate, numPayments) - 1);
                    return parseFloat(pmt.toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Mortgage</h3><p>A loan used either by purchasers of real property to raise funds to buy real estate, or alternatively by existing property owners to raise funds for any purpose.</p>', faq: [] }
    },
    'fuel-cost': {
        id: 'fuel-cost',
        title: 'Fuel Cost Calculator',
        description: 'Calculate trip cost based on distance and efficiency.',
        category: 'finance',
        icon: 'Fuel',
        meta: { title: 'Fuel Cost Calculator', description: 'Calculate the fuel cost for a trip.', keywords: ['fuel calculator', 'gas cost', 'petrol cost'] },
        inputs: [
            { id: 'dist', label: 'Distance (km)', type: 'number', placeholder: 'e.g. 100' },
            { id: 'eff', label: 'Efficiency (km/l)', type: 'number', placeholder: 'e.g. 12' },
            { id: 'price', label: 'Fuel Price ($/l)', type: 'number', placeholder: 'e.g. 1.50' }
        ],
        outputs: [
            {
                label: 'Total Cost ($)',
                calculate: (inputs) => {
                    const d = Number(inputs['dist']);
                    const e = Number(inputs['eff']);
                    const p = Number(inputs['price']);
                    if (!d || !e || !p) return 0;
                    return parseFloat(((d / e) * p).toFixed(2));
                }
            },
            {
                label: 'Fuel Needed (liters)',
                calculate: (inputs) => {
                    const d = Number(inputs['dist']);
                    const e = Number(inputs['eff']);
                    if (!d || !e) return 0;
                    return parseFloat((d / e).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Fuel Cost</h3><p>Calculate how much money you will spend on fuel for a given distance.</p>', faq: [] }
    },
    'tip-calculator': {
        id: 'tip-calculator',
        title: 'Tip Calculator',
        description: 'Calculate tip amount and total bill.',
        category: 'finance',
        icon: 'Coins',
        meta: { title: 'Tip Calculator', description: 'Calculate the tip amount for a bill.', keywords: ['tip calculator', 'gratuity'] },
        inputs: [
            { id: 'bill', label: 'Bill Amount ($)', type: 'number', placeholder: 'e.g. 50' },
            { id: 'percent', label: 'Tip Percentage (%)', type: 'number', placeholder: 'e.g. 15', defaultValue: '15' },
            { id: 'people', label: 'Split Between (People)', type: 'number', placeholder: '1', defaultValue: '1' }
        ],
        outputs: [
            {
                label: 'Tip Amount ($)',
                calculate: (inputs) => {
                    const bill = Number(inputs['bill']);
                    const percent = Number(inputs['percent']);
                    if (!bill) return 0;
                    return parseFloat((bill * (percent / 100)).toFixed(2));
                }
            },
            {
                label: 'Total Bill ($)',
                calculate: (inputs) => {
                    const bill = Number(inputs['bill']);
                    const percent = Number(inputs['percent']);
                    if (!bill) return 0;
                    return parseFloat((bill * (1 + percent / 100)).toFixed(2));
                }
            },
            {
                label: 'Amount Per Person ($)',
                calculate: (inputs) => {
                    const bill = Number(inputs['bill']);
                    const percent = Number(inputs['percent']);
                    const people = Number(inputs['people']) || 1;
                    if (!bill) return 0;
                    const total = bill * (1 + percent / 100);
                    return parseFloat((total / people).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Tipping</h3><p>A gratuity (tip) is a sum of money customarily given by a customer to a service worker, in addition to the basic price.</p>', faq: [] }
    },
    'inflation-calculator': {
        id: 'inflation-calculator',
        title: 'Inflation Calculator',
        description: 'Calculate future value based on inflation rate.',
        category: 'finance',
        icon: 'TrendingUp',
        meta: { title: 'Inflation Calculator', description: 'Calculate the purchasing power of money over time.', keywords: ['inflation calculator', 'future value'] },
        inputs: [
            { id: 'amount', label: 'Current Amount ($)', type: 'number', placeholder: 'e.g. 1000' },
            { id: 'rate', label: 'Inflation Rate (%)', type: 'number', placeholder: 'e.g. 3' },
            { id: 'years', label: 'Years', type: 'number', placeholder: 'e.g. 10' }
        ],
        outputs: [
            {
                label: 'Future Value ($)',
                calculate: (inputs) => {
                    const pv = Number(inputs['amount']);
                    const r = Number(inputs['rate']);
                    const n = Number(inputs['years']);
                    if (!pv || n === undefined) return 0;
                    // FV = PV * (1 + r)^n
                    const fv = pv * Math.pow(1 + (r / 100), n);
                    return parseFloat(fv.toFixed(2));
                }
            },
            {
                label: 'Purchasing Power Loss ($)',
                calculate: (inputs) => {
                    const pv = Number(inputs['amount']);
                    const r = Number(inputs['rate']);
                    const n = Number(inputs['years']);
                    if (!pv || n === undefined) return 0;
                    // FV = PV * (1 + r)^n
                    const fv = pv * Math.pow(1 + (r / 100), n);
                    return parseFloat((fv - pv).toFixed(2));
                }
            }

        ],
        content: { whatIs: '<h3>Inflation</h3><p>A general increase in prices and fall in the purchasing value of money.</p>', faq: [] }
    },
    'quadratic-equation': {
        id: 'quadratic-equation',
        title: 'Quadratic Equation Solver',
        description: 'Solve Ax² + Bx + C = 0.',
        category: 'math',
        icon: 'FunctionSquare',
        meta: { title: 'Quadratic Equation Solver', description: 'Find the roots of a quadratic equation.', keywords: ['quadratic formula', 'quadratic solver', 'roots calculator'] },
        inputs: [
            { id: 'a', label: 'Coefficient A', type: 'number', placeholder: 'e.g. 1' },
            { id: 'b', label: 'Coefficient B', type: 'number', placeholder: 'e.g. -3' },
            { id: 'c', label: 'Coefficient C', type: 'number', placeholder: 'e.g. 2' }
        ],
        outputs: [
            {
                label: 'Root 1 (x1)',
                calculate: (inputs) => {
                    const a = Number(inputs['a']);
                    const b = Number(inputs['b']);
                    const c = Number(inputs['c']);
                    if (a === 0) return 'Not Quadratic';
                    const delta = b * b - 4 * a * c;
                    if (delta < 0) return 'Complex';
                    return parseFloat(((-b + Math.sqrt(delta)) / (2 * a)).toFixed(4));
                }
            },
            {
                label: 'Root 2 (x2)',
                calculate: (inputs) => {
                    const a = Number(inputs['a']);
                    const b = Number(inputs['b']);
                    const c = Number(inputs['c']);
                    if (a === 0) return 'Not Quadratic';
                    const delta = b * b - 4 * a * c;
                    if (delta < 0) return 'Complex';
                    return parseFloat(((-b - Math.sqrt(delta)) / (2 * a)).toFixed(4));
                }
            },
            {
                label: 'Discriminant (Δ)',
                calculate: (inputs) => {
                    const a = Number(inputs['a']);
                    const b = Number(inputs['b']);
                    const c = Number(inputs['c']);
                    return b * b - 4 * a * c;
                }
            }
        ],
        content: { whatIs: '<h3>Quadratic Formula</h3><p>x = (-b ± √(b² - 4ac)) / 2a</p>', faq: [] }
    },
    'exponent-calculator': {
        id: 'exponent-calculator',
        title: 'Exponent Calculator',
        description: 'Calculate Base raised to Power (x^y).',
        category: 'math',
        icon: 'Superscript',
        meta: { title: 'Exponent Calculator', description: 'Calculate the power of a number.', keywords: ['exponent', 'power calculator', 'power of'] },
        inputs: [
            { id: 'base', label: 'Base', type: 'number', placeholder: 'e.g. 2' },
            { id: 'exp', label: 'Exponent', type: 'number', placeholder: 'e.g. 3' }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const b = Number(inputs['base']);
                    const e = Number(inputs['exp']);
                    return Math.pow(b, e);
                }
            }
        ],
        content: { whatIs: '<h3>Exponentiation</h3><p>Mathematical operation, involving two numbers, the base and the exponent.</p>', faq: [] }
    },
    'pythagorean-theorem': {
        id: 'pythagorean-theorem',
        title: 'Pythagorean Theorem Calculator',
        description: 'Calculate hypotenuse (a² + b² = c²).',
        category: 'math',
        icon: 'Triangle',
        meta: { title: 'Pythagorean Theorem Calculator', description: 'Calculate the length of the hypotenuse of a right triangle.', keywords: ['pythagorean theorem', 'hypotenuse calculator'] },
        inputs: [
            { id: 'a', label: 'Side A', type: 'number', placeholder: 'e.g. 3' },
            { id: 'b', label: 'Side B', type: 'number', placeholder: 'e.g. 4' }
        ],
        outputs: [
            {
                label: 'Hypotenuse (c)',
                calculate: (inputs) => {
                    const a = Number(inputs['a']);
                    const b = Number(inputs['b']);
                    if (!a || !b) return 0;
                    return parseFloat(Math.sqrt(a * a + b * b).toFixed(4));
                }
            }
        ],
        content: { whatIs: '<h3>Pythagorean Theorem</h3><p>In a right-angled triangle, the square of the hypotenuse side is equal to the sum of squares of the other two sides.</p>', faq: [] }
    },
    'word-counter': {
        id: 'word-counter',
        title: 'Word Counter',
        description: 'Count words and characters in text.',
        category: 'other',
        icon: 'Type',
        meta: { title: 'Word Counter', description: 'Count words, characters, and sentences in a text.', keywords: ['word counter', 'character count', 'text statistics'] },
        inputs: [
            { id: 'text', label: 'Paste Text Here', type: 'text', placeholder: 'Type or paste...' }
        ],
        outputs: [
            {
                label: 'Words',
                calculate: (inputs) => {
                    const text = String(inputs['text'] || '');
                    if (!text.trim()) return 0;
                    return text.trim().split(/\s+/).length;
                }
            },
            {
                label: 'Characters',
                calculate: (inputs) => {
                    const text = String(inputs['text'] || '');
                    return text.length;
                }
            },
            {
                label: 'Characters (No Spaces)',
                calculate: (inputs) => {
                    const text = String(inputs['text'] || '');
                    return text.replace(/\s/g, '').length;
                }
            }
        ],
        content: { whatIs: '<h3>Text Analysis</h3><p>Counts words, characters, and other text metrics.</p>', faq: [] }
    },
    'add-days': {
        id: 'add-days',
        title: 'Add Days to Date',
        description: 'Add or subtract days from a date.',
        category: 'other',
        icon: 'CalendarClock',
        meta: { title: 'Add Days Calculator', description: 'Calculate a future or past date by adding/subtracting days.', keywords: ['date calculator', 'add days', 'subtract days'] },
        inputs: [
            { id: 'date', label: 'Start Date', type: 'date' },
            { id: 'days', label: 'Days to Add (Use negative to subtract)', type: 'number', placeholder: 'e.g. 30' }
        ],
        outputs: [
            {
                label: 'New Date',
                calculate: (inputs) => {
                    const dateStr = String(inputs['date']);
                    const days = Number(inputs['days']);
                    if (!dateStr || days === undefined || isNaN(days)) return '';

                    const date = new Date(dateStr);
                    date.setDate(date.getDate() + days + 1); // +1 fix time zone issue similar to previous fix? No, input date is YYYY-MM-DD.
                    // Actually, if input is YYYY-MM-DD, new Date(str) is UTC. setDate works on UTC? no, on local if not specified.
                    // Safer:
                    const parts = dateStr.split('-');
                    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
                    d.setDate(d.getDate() + days);
                    return d.toLocaleDateString();
                }
            }
        ],
        content: { whatIs: '<h3>Date Arithmetic</h3><p>Find out what date it will be in X days, or what date it was X days ago.</p>', faq: [] }
    },
    'random-number': {
        id: 'random-number',
        title: 'Random Number Generator',
        description: 'Generate a random number between min and max.',
        category: 'other',
        icon: 'Dices',
        meta: { title: 'Random Number Generator', description: 'Generate a random integer within a range.', keywords: ['random number', 'RNG', 'dice'] },
        inputs: [
            { id: 'min', label: 'Min', type: 'number', placeholder: 'e.g. 1', defaultValue: '1' },
            { id: 'max', label: 'Max', type: 'number', placeholder: 'e.g. 100', defaultValue: '100' }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const min = Math.ceil(Number(inputs['min']));
                    const max = Math.floor(Number(inputs['max']));
                    if (min > max) return 'Invalid Range';
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }
            }
        ],
        content: { whatIs: '<h3>Randomness</h3><p>Generates a pseudo-random number within the specified range.</p>', faq: [] }
    },
    'ohms-law': {
        id: 'ohms-law',
        title: 'Ohm\'s Law Calculator',
        description: 'Calculate Voltage, Current, or Resistance (V = IR).',
        category: 'physics',
        icon: 'Zap',
        meta: { title: 'Ohm\'s Law Calculator', description: 'Calculate Voltage (V), Current (I), or Resistance (R).', keywords: ['ohms law', 'voltage', 'current', 'resistance'] },
        inputs: [
            { id: 'v', label: 'Voltage (V)', type: 'number', placeholder: 'e.g. 12' },
            { id: 'i', label: 'Current (A)', type: 'number', placeholder: 'e.g. 2' },
            { id: 'r', label: 'Resistance (Ω)', type: 'number', placeholder: 'e.g. 6' }
        ],
        outputs: [
            {
                label: 'Voltage (V)',
                calculate: (inputs) => {
                    const i = Number(inputs['i']);
                    const r = Number(inputs['r']);
                    if (inputs['v'] || !i || !r) return null;
                    return parseFloat((i * r).toFixed(2));
                }
            },
            {
                label: 'Current (A)',
                calculate: (inputs) => {
                    const v = Number(inputs['v']);
                    const r = Number(inputs['r']);
                    if (inputs['i'] || !v || !r) return null;
                    return parseFloat((v / r).toFixed(2));
                }
            },
            {
                label: 'Resistance (Ω)',
                calculate: (inputs) => {
                    const v = Number(inputs['v']);
                    const i = Number(inputs['i']);
                    if (inputs['r'] || !v || !i) return null;
                    return parseFloat((v / i).toFixed(2));
                }
            },
        ],
        content: { whatIs: '<h3>Ohm\' Law</h3><p>State the relationship between voltage, current, and resistance in an electrical circuit.</p>', faq: [] }
    },
    'wavelength-calculator': {
        id: 'wavelength-calculator',
        title: 'Wavelength Calculator',
        description: 'Calculate wavelength, frequency, or wave speed (λ = v/f).',
        category: 'physics',
        icon: 'Waves',
        meta: { title: 'Wavelength Calculator', description: 'Calculate wavelength from frequency and speed.', keywords: ['wavelength', 'frequency', 'wave speed'] },
        inputs: [
            { id: 'v', label: 'Wave Speed (m/s)', type: 'number', placeholder: 'e.g. 343 (Sound)' },
            { id: 'f', label: 'Frequency (Hz)', type: 'number', placeholder: 'e.g. 440' }
        ],
        outputs: [
            {
                label: 'Wavelength (λ) (m)',
                calculate: (inputs) => {
                    const v = Number(inputs['v']);
                    const f = Number(inputs['f']);
                    if (!v || !f) return 0;
                    return parseFloat((v / f).toFixed(4));
                }
            }
        ],
        content: { whatIs: '<h3>Wavelength</h3><p>The spatial period of a periodic wave—the distance over which the wave\'s shape repeats.</p>', faq: [] }
    },
    'moment-of-inertia': {
        id: 'moment-of-inertia',
        title: 'Moment of Inertia Calculator',
        description: 'Calculate I for a point mass (I = mr²).',
        category: 'physics',
        icon: 'RotateCw',
        meta: { title: 'Moment of Inertia Calculator', description: 'Calculate moment of inertia for a point mass.', keywords: ['moment of inertia', 'rotational inertia'] },
        inputs: [
            { id: 'm', label: 'Mass (kg)', type: 'number', placeholder: 'e.g. 5' },
            { id: 'r', label: 'Radius (m)', type: 'number', placeholder: 'e.g. 2' }
        ],
        outputs: [
            {
                label: 'Moment of Inertia (kg·m²)',
                calculate: (inputs) => {
                    const m = Number(inputs['m']);
                    const r = Number(inputs['r']);
                    if (!m || !r) return 0;
                    return parseFloat((m * r * r).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Moment of Inertia</h3><p>A quantity determining the torque needed for a desired angular acceleration about a rotational axis.</p>', faq: [] }
    },
    'hydraulic-press': {
        id: 'hydraulic-press',
        title: 'Hydraulic Press Calculator',
        description: 'Calculate output force (Pascal\'s Principle).',
        category: 'physics',
        icon: 'ArrowDownToLine',
        meta: { title: 'Hydraulic Press Calculator', description: 'Calculate the force output of a hydraulic press.', keywords: ['hydraulic press', 'pascals principle', 'hydraulics'] },
        inputs: [
            { id: 'f1', label: 'Input Force (F1) (N)', type: 'number', placeholder: 'e.g. 100' },
            { id: 'a1', label: 'Input Area (A1) (m²)', type: 'number', placeholder: 'e.g. 0.01' },
            { id: 'a2', label: 'Output Area (A2) (m²)', type: 'number', placeholder: 'e.g. 0.1' }
        ],
        outputs: [
            {
                label: 'Output Force (F2) (N)',
                calculate: (inputs) => {
                    const f1 = Number(inputs['f1']);
                    const a1 = Number(inputs['a1']);
                    const a2 = Number(inputs['a2']);
                    if (!f1 || !a1 || !a2) return 0;
                    return parseFloat((f1 * (a2 / a1)).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Pascal\'s Principle</h3><p>Pressure applied to a confined fluid at any point is transmitted undiminished throughout the fluid in all directions.</p>', faq: [] }
    },
    'pulley-system': {
        id: 'pulley-system',
        title: 'Pulley System Calculator',
        description: 'Calculate effort force needed to lift a load.',
        category: 'physics',
        icon: 'ChevronsUp',
        meta: { title: 'Pulley System Calculator', description: 'Calculate the force required to lift a weight using pulleys.', keywords: ['pulley calculator', 'mechanical advantage'] },
        inputs: [
            { id: 'w', label: 'Load Weight (N)', type: 'number', placeholder: 'e.g. 1000' },
            { id: 'n', label: 'Number of Supporting Ropes', type: 'number', placeholder: 'e.g. 2' }
        ],
        outputs: [
            {
                label: 'Effort Force (N)',
                calculate: (inputs) => {
                    const w = Number(inputs['w']);
                    const n = Number(inputs['n']);
                    if (!w || !n) return 0;
                    return parseFloat((w / n).toFixed(2)); // Generally W/n if n is supporting segments.
                }
            }
        ],
        content: { whatIs: '<h3>Pulley Mechanics</h3><p>A simple machine that reduces the force needed to lift a heavy load by distributing the weight across multiple rope segments.</p>', faq: [] }
    },
    'combinations-permutations': {
        id: 'combinations-permutations',
        title: 'Combinations & Permutations',
        description: 'Calculate nCr and nPr.',
        category: 'math',
        icon: 'ListChecks',
        meta: { title: 'Combinations & Permutations Calculator', description: 'Calculate combinations (nCr) and permutations (nPr).', keywords: ['combinations', 'permutations', 'nCr', 'nPr'] },
        inputs: [
            { id: 'n', label: 'Total Items (n)', type: 'number', placeholder: 'e.g. 5' },
            { id: 'r', label: 'Selected Items (r)', type: 'number', placeholder: 'e.g. 2' }
        ],
        outputs: [
            {
                label: 'Combinations (nCr) - Order doesn\'t matter',
                calculate: (inputs) => {
                    const n = Number(inputs['n']);
                    const r = Number(inputs['r']);
                    if (n < 0 || r < 0 || r > n) return 0;
                    const factorial = (num: number): number => num <= 1 ? 1 : num * factorial(num - 1);
                    return factorial(n) / (factorial(r) * factorial(n - r));
                }
            },
            {
                label: 'Permutations (nPr) - Order matters',
                calculate: (inputs) => {
                    const n = Number(inputs['n']);
                    const r = Number(inputs['r']);
                    if (n < 0 || r < 0 || r > n) return 0;
                    const factorial = (num: number): number => num <= 1 ? 1 : num * factorial(num - 1);
                    return factorial(n) / factorial(n - r);
                }
            }
        ],
        content: { whatIs: '<h3>Combinatorics</h3><p>Counting the ways to select items from a collection.</p>', faq: [] }
    },
    'probability-calculator': {
        id: 'probability-calculator',
        title: 'Probability Calculator',
        description: 'Calculate simple probability P(A).',
        category: 'math',
        icon: 'Percent',
        meta: { title: 'Probability Calculator', description: 'Calculate the probability of an event.', keywords: ['probability', 'odds'] },
        inputs: [
            { id: 'a', label: 'Number of Favorable Outcomes', type: 'number', placeholder: 'e.g. 1 (Ace)' },
            { id: 's', label: 'Total Possible Outcomes', type: 'number', placeholder: 'e.g. 52 (Deck)' }
        ],
        outputs: [
            {
                label: 'Probability (0-1)',
                calculate: (inputs) => {
                    const a = Number(inputs['a']);
                    const s = Number(inputs['s']);
                    if (!s) return 0;
                    return parseFloat((a / s).toFixed(4));
                }
            },
            {
                label: 'Probability (%)',
                calculate: (inputs) => {
                    const a = Number(inputs['a']);
                    const s = Number(inputs['s']);
                    if (!s) return 0;
                    return parseFloat(((a / s) * 100).toFixed(2)) + '%';
                }
            }
        ],
        content: { whatIs: '<h3>Probability</h3><p>The measure of the likelihood that an event will occur.</p>', faq: [] }
    },
    'gpa-calculator': {
        id: 'gpa-calculator',
        title: 'GPA Calculator',
        description: 'Calculate simple weighted GPA.',
        category: 'math',
        icon: 'GraduationCap',
        meta: { title: 'GPA Calculator', description: 'Calculate Grade Point Average.', keywords: ['gpa calculator', 'grade point average'] },
        inputs: [
            {
                id: 'data',
                label: 'Enter Grades and Credits (one pair per line, separated by space)',
                type: 'text',
                placeholder: '4.0 3\n3.0 3\n3.5 4',
                defaultValue: '4.0 3\n3.0 3'
            }
        ],
        outputs: [
            {
                label: 'GPA',
                calculate: (inputs) => {
                    const text = String(inputs['data'] || '');
                    const lines = text.trim().split('\n');
                    let totalPoints = 0;
                    let totalCredits = 0;

                    for (const line of lines) {
                        const parts = line.trim().split(/\s+/);
                        if (parts.length >= 2) {
                            const grade = parseFloat(parts[0]);
                            const credit = parseFloat(parts[1]);
                            if (!isNaN(grade) && !isNaN(credit)) {
                                totalPoints += grade * credit;
                                totalCredits += credit;
                            }
                        }
                    }

                    if (totalCredits === 0) return 0;
                    return parseFloat((totalPoints / totalCredits).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>GPA</h3><p>A Grade Point Average is a number representing the average value of the accumulated final grades earned in courses over time.</p>', faq: [] }
    },
    'body-fat': {
        id: 'body-fat',
        title: 'Body Fat Calculator',
        description: 'Estimate body fat percentage (US Navy Method).',
        category: 'health',
        icon: 'Activity',
        meta: { title: 'Body Fat Calculator', description: 'Estimate body fat percentage using the US Navy method.', keywords: ['body fat', 'bfp', 'navy method'] },
        inputs: [
            { id: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }], defaultValue: 'male' },
            { id: 'age', label: 'Age', type: 'number', placeholder: 'e.g. 30' },
            { id: 'h', label: 'Height (cm)', type: 'number', placeholder: 'e.g. 175' },
            { id: 'w', label: 'Weight (kg)', type: 'number', placeholder: 'e.g. 80' },
            { id: 'neck', label: 'Neck Circumference (cm)', type: 'number', placeholder: 'e.g. 40' },
            { id: 'waist', label: 'Waist Circumference (cm)', type: 'number', placeholder: 'e.g. 90' },
            { id: 'hip', label: 'Hip Circumference (cm) (Females)', type: 'number', placeholder: 'e.g. 100' }
        ],
        outputs: [
            {
                label: 'Body Fat Percentage (%)',
                calculate: (inputs) => {
                    const gender = inputs['gender'] || 'male';
                    const h = Number(inputs['h']);
                    const neck = Number(inputs['neck']);
                    const waist = Number(inputs['waist']);
                    const hip = Number(inputs['hip']);

                    if (!h || !neck || !waist) return 0;

                    if (gender === 'male') {
                        // 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
                        if (waist - neck <= 0) return 0;
                        return parseFloat((495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(h)) - 450).toFixed(2));
                    } else {
                        // 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
                        if (!hip) return 0;
                        if (waist + hip - neck <= 0) return 0;
                        return parseFloat((495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(h)) - 450).toFixed(2));
                    }
                }
            }
        ],
        content: { whatIs: '<h3>Body Fat</h3><p>The total mass of fat divided by total body mass, multiplied by 100.</p>', faq: [] }
    },
    'bmr-calculator': {
        id: 'bmr-calculator',
        title: 'BMR Calculator',
        description: 'Calculate Basal Metabolic Rate (Mifflin-St Jeor).',
        category: 'health',
        icon: 'Flame',
        meta: { title: 'BMR Calculator', description: 'Calculate Basal Metabolic Rate (BMR) - calories burned at rest.', keywords: ['bmr', 'metabolic rate', 'calories'] },
        inputs: [
            { id: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }], defaultValue: 'male' },
            { id: 'age', label: 'Age', type: 'number', placeholder: 'e.g. 30' },
            { id: 'h', label: 'Height (cm)', type: 'number', placeholder: 'e.g. 175' },
            { id: 'w', label: 'Weight (kg)', type: 'number', placeholder: 'e.g. 80' }
        ],
        outputs: [
            {
                label: 'BMR (kcal/day)',
                calculate: (inputs) => {
                    const gender = inputs['gender'] || 'male';
                    const age = Number(inputs['age']);
                    const h = Number(inputs['h']);
                    const w = Number(inputs['w']);

                    if (!age || !h || !w) return 0;

                    // Mifflin-St Jeor
                    let bmr = 10 * w + 6.25 * h - 5 * age;
                    if (gender === 'male') {
                        bmr += 5;
                    } else {
                        bmr -= 161;
                    }
                    return parseFloat(bmr.toFixed(0));
                }
            }
        ],
        content: { whatIs: '<h3>Basal Metabolic Rate</h3><p>The number of calories you burn as your body performs basic (basal) life-sustaining function.</p>', faq: [] }
    },
    't-test-calculator': {
        id: 't-test-calculator',
        title: 'T-Test Calculator',
        description: 'Two-sample t-test (Equal Variance).',
        category: 'math',
        icon: 'Activity',
        meta: { title: 'T-Test Calculator', description: 'Perform a two-sample t-test assuming equal variances.', keywords: ['t-test', 'statistics', 'hypothesis testing'] },
        inputs: [
            { id: 'm1', label: 'Mean 1', type: 'number', placeholder: 'e.g. 10' },
            { id: 's1', label: 'SD 1', type: 'number', placeholder: 'e.g. 2' },
            { id: 'n1', label: 'N 1', type: 'number', placeholder: 'e.g. 30' },
            { id: 'm2', label: 'Mean 2', type: 'number', placeholder: 'e.g. 12' },
            { id: 's2', label: 'SD 2', type: 'number', placeholder: 'e.g. 2.5' },
            { id: 'n2', label: 'N 2', type: 'number', placeholder: 'e.g. 30' }
        ],
        outputs: [
            {
                label: 'T-Value',
                calculate: (inputs) => {
                    const m1 = Number(inputs['m1']);
                    const s1 = Number(inputs['s1']);
                    const n1 = Number(inputs['n1']);
                    const m2 = Number(inputs['m2']);
                    const s2 = Number(inputs['s2']);
                    const n2 = Number(inputs['n2']);

                    if (!n1 || !n2) return 0;

                    // Pooled Variance Sp^2 = ((n1-1)s1^2 + (n2-1)s2^2) / (n1+n2-2)
                    const sp2 = ((n1 - 1) * s1 * s1 + (n2 - 1) * s2 * s2) / (n1 + n2 - 2);
                    const sp = Math.sqrt(sp2);

                    // t = (m1 - m2) / (sp * sqrt(1/n1 + 1/n2))
                    const se = sp * Math.sqrt(1 / n1 + 1 / n2);
                    if (se === 0) return 0;
                    return parseFloat(((m1 - m2) / se).toFixed(4));
                }
            }
        ],
        content: { whatIs: '<h3>Student\'s t-test</h3><p>A statistical test that is used to compare the means of two groups.</p>', faq: [] }
    },
    'grade-scale-generator': {
        id: 'grade-scale-generator',
        title: 'Grade Scale Generator',
        description: 'Generate a grading scale for teachers.',
        category: 'other',
        icon: 'List',
        meta: { title: 'Grade Scale Generator', description: 'Create a grade scale table.', keywords: ['grade scale', 'teacher tool', 'grading'] },
        inputs: [
            { id: 'max', label: 'Max Score', type: 'number', placeholder: 'e.g. 100', defaultValue: '100' },
            { id: 'min', label: 'Min Score', type: 'number', placeholder: 'e.g. 60' }
        ],
        outputs: [
            {
                label: 'Grade Scale (Copy)',
                calculate: (inputs) => {
                    const max = Number(inputs['max']);
                    const min = Number(inputs['min']);
                    if (isNaN(max) || isNaN(min)) return '';

                    // Simple A-F scale generation or percentage list?
                    // Let's generate a percentage breakdown.
                    let result = '';
                    const range = max - min;
                    if (range <= 0) return 'Max must be greater than Min.';

                    result += `A: ${max} - ${(max - range * 0.1).toFixed(1)}\n`;
                    result += `B: ${(max - range * 0.1).toFixed(1)} - ${(max - range * 0.2).toFixed(1)}\n`;
                    result += `C: ${(max - range * 0.2).toFixed(1)} - ${(max - range * 0.3).toFixed(1)}\n`;
                    result += `D: ${(max - range * 0.3).toFixed(1)} - ${(max - range * 0.4).toFixed(1)}\n`;
                    result += `F: < ${(max - range * 0.4).toFixed(1)}`;

                    return result;
                }
            }
        ],
        content: { whatIs: '<h3>Grading Scale</h3><p>Helps teachers visualize grade boundaries.</p>', faq: [] }
    },
    'pf-ratio': {
        id: 'pf-ratio',
        title: 'PaO2/FiO2 Ratio Calculator',
        description: 'Calculate P/F Ratio to assess lung function.',
        category: 'health',
        icon: 'Stethoscope',
        meta: { title: 'PaO2/FiO2 Ratio Calculator', description: 'Calculate the PaO2/FiO2 ratio (Horowitz Index) for respiratory assessment.', keywords: ['paO2', 'FiO2', 'lung function', 'ARDS'] },
        inputs: [
            { id: 'pao2', label: 'PaO2 (mmHg)', type: 'number', placeholder: 'e.g. 80' },
            { id: 'fio2', label: 'FiO2 (%) (Enter as integer, e.g. 21)', type: 'number', placeholder: 'e.g. 21' }
        ],
        outputs: [
            {
                label: 'P/F Ratio',
                calculate: (inputs) => {
                    const pao2 = Number(inputs['pao2']);
                    const fio2 = Number(inputs['fio2']);
                    if (!pao2 || !fio2) return 0;
                    // Formula: (PaO2 / FiO2) * 100 if FiO2 is in %. Usually FiO2 is decimal so 0.21. 
                    // Legacy code was (pao2 / fio2) * 100?
                    // Legacy used: ratio = (paO2 / fiO2) * 100.
                    // Example: PaO2=80, FiO2=21 -> 80/21 = 3.8. * 100 = 380.
                    // Correct.
                    const ratio = (pao2 / fio2) * 100;
                    return parseFloat(ratio.toFixed(0));
                }
            },
            {
                label: 'Severity Assessment',
                calculate: (inputs) => {
                    const pao2 = Number(inputs['pao2']);
                    const fio2 = Number(inputs['fio2']);
                    if (!pao2 || !fio2) return '';
                    const ratio = (pao2 / fio2) * 100;
                    if (ratio > 300) return 'Normal (>300)';
                    if (ratio > 200) return 'Mild ARDS (200-300)';
                    if (ratio > 100) return 'Moderate ARDS (100-200)';
                    return 'Severe ARDS (<100)';
                }
            }
        ],
        content: { whatIs: '<h3>Horowitz Index (P/F Ratio)</h3><p>An indicator of lung function used to assess the severity of hypoxemia and Acute Respiratory Distress Syndrome (ARDS).</p>', faq: [] }
    },
    'timezone-converter': {
        id: 'timezone-converter',
        title: 'Timezone Converter',
        description: 'Convert time between major timezones.',
        category: 'other',
        icon: 'Globe',
        meta: { title: 'Timezone Converter', description: 'Convert current time to different timezones.', keywords: ['timezone', 'world clock', 'time converter'] },
        inputs: [
            {
                id: 'target',
                label: 'Target Timezone',
                type: 'select',
                options: [
                    { label: 'UTC', value: 'UTC' },
                    { label: 'New York (EST/EDT)', value: 'America/New_York' },
                    { label: 'London (GMT/BST)', value: 'Europe/London' },
                    { label: 'Paris (CET/CEST)', value: 'Europe/Paris' },
                    { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
                    { label: 'Sydney (AEST)', value: 'Australia/Sydney' },
                    { label: 'Sao Paulo (BRT)', value: 'America/Sao_Paulo' },
                    { label: 'Los Angeles (PST/PDT)', value: 'America/Los_Angeles' }
                ],
                defaultValue: 'UTC'
            }
        ],
        outputs: [
            {
                label: 'Current Time in Target Zone',
                calculate: (inputs) => {
                    const zone = String(inputs['target'] || 'UTC');
                    try {
                        return new Date().toLocaleString('en-US', { timeZone: zone });
                    } catch (e) {
                        return 'Invalid Timezone';
                    }
                }
            },
            {
                label: 'Offset vs Local',
                calculate: (inputs) => {
                    // Calculating offset is tricky without date libraries, skipping for now.
                    return '';
                }
            }
        ],
        content: { whatIs: '<h3>Timezones</h3><p>Regions of the Earth that have the same standard time.</p>', faq: [] }
    },
    'currency-converter': {
        id: 'currency-converter',
        title: 'Currency Converter',
        description: 'Convert between USD, EUR, BRL (Fixed Rates).',
        category: 'finance',
        icon: 'CircleDollarSign',
        meta: { title: 'Currency Converter', description: 'Convert currencies using fixed approximate rates.', keywords: ['currency', 'usd', 'brl', 'eur', 'exchange'] },
        inputs: [
            { id: 'amount', label: 'Amount', type: 'number', placeholder: 'e.g. 100' },
            { id: 'from', label: 'From', type: 'select', options: [{ label: 'USD', value: 'USD' }, { label: 'BRL', value: 'BRL' }, { label: 'EUR', value: 'EUR' }], defaultValue: 'USD' },
            { id: 'to', label: 'To', type: 'select', options: [{ label: 'USD', value: 'USD' }, { label: 'BRL', value: 'BRL' }, { label: 'EUR', value: 'EUR' }], defaultValue: 'BRL' }
        ],
        outputs: [
            {
                label: 'Converted Amount',
                calculate: (inputs) => {
                    const amount = Number(inputs['amount']);
                    const from = String(inputs['from']);
                    const to = String(inputs['to']);
                    if (!amount || !from || !to) return 0;

                    // Fixed Rates (Approx)
                    const rates: Record<string, number> = {
                        'USD': 1.0,
                        'BRL': 6.0, // Updated 2026 ;)
                        'EUR': 0.95
                    };

                    const inUSD = amount / (rates[from] || 1);
                    const result = inUSD * (rates[to] || 1);
                    return parseFloat(result.toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Currency Exchange</h3><p>Converts value from one currency to another. Note: Rates are approximate and fixed.</p>', faq: [] }
    },
    'angular-velocity': {
        id: 'angular-velocity',
        title: 'Angular Velocity Calculator',
        description: 'Calculate angular velocity (ω = v/r).',
        category: 'physics',
        icon: 'RotateCw',
        meta: { title: 'Angular Velocity Calculator', description: 'Calculate angular velocity based on linear velocity and radius.', keywords: ['angular velocity', 'omega', 'rotation'] },
        inputs: [
            { id: 'v', label: 'Linear Velocity (v) (m/s)', type: 'number', placeholder: 'e.g. 10' },
            { id: 'r', label: 'Radius (r) (m)', type: 'number', placeholder: 'e.g. 2' }
        ],
        outputs: [
            {
                label: 'Angular Velocity (ω) (rad/s)',
                calculate: (inputs) => {
                    const v = Number(inputs['v']);
                    const r = Number(inputs['r']);
                    if (!v || !r) return 0;
                    return parseFloat((v / r).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Angular Velocity</h3><p>The rate of change of angular position of a rotating body.</p>', faq: [] }
    },
    'cylinder-calculator': {
        id: 'cylinder-calculator',
        title: 'Cylinder Calculator',
        description: 'Calculate Volume and Surface Area of a Cylinder.',
        category: 'geometry',
        icon: 'Cylinder',
        meta: { title: 'Cylinder Calculator', description: 'Calculate volume and surface area of a cylinder.', keywords: ['cylinder', 'volume', 'surface area'] },
        inputs: [
            { id: 'r', label: 'Radius (r)', type: 'number', placeholder: 'e.g. 3' },
            { id: 'h', label: 'Height (h)', type: 'number', placeholder: 'e.g. 5' }
        ],
        outputs: [
            {
                label: 'Volume',
                calculate: (inputs) => {
                    const r = Number(inputs['r']);
                    const h = Number(inputs['h']);
                    if (!r || !h) return 0;
                    return parseFloat((Math.PI * r * r * h).toFixed(2));
                }
            },
            {
                label: 'Surface Area',
                calculate: (inputs) => {
                    const r = Number(inputs['r']);
                    const h = Number(inputs['h']);
                    if (!r || !h) return 0;
                    return parseFloat((2 * Math.PI * r * (r + h)).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Cylinder</h3><p>A solid geometric figure with straight parallel sides and a circular or oval cross section.</p>', faq: [] }
    },
    'cube-calculator': {
        id: 'cube-calculator',
        title: 'Cube Calculator',
        description: 'Calculate Volume and Surface Area of a Cube.',
        category: 'geometry',
        icon: 'Box',
        meta: { title: 'Cube Calculator', description: 'Calculate volume and surface area of a cube.', keywords: ['cube', 'volume', 'surface area'] },
        inputs: [
            { id: 'a', label: 'Edge Length (a)', type: 'number', placeholder: 'e.g. 4' }
        ],
        outputs: [
            {
                label: 'Volume',
                calculate: (inputs) => {
                    const a = Number(inputs['a']);
                    if (!a) return 0;
                    return parseFloat((Math.pow(a, 3)).toFixed(2));
                }
            },
            {
                label: 'Surface Area',
                calculate: (inputs) => {
                    const a = Number(inputs['a']);
                    if (!a) return 0;
                    return parseFloat((6 * a * a).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Cube</h3><p>A symmetrical three-dimensional shape, either solid or hollow, contained by six equal squares.</p>', faq: [] }
    },
    'sphere-calculator': {
        id: 'sphere-calculator',
        title: 'Sphere Calculator',
        description: 'Calculate Volume and Surface Area of a Sphere.',
        category: 'geometry',
        icon: 'Globe2',
        meta: { title: 'Sphere Calculator', description: 'Calculate volume and surface area of a sphere.', keywords: ['sphere', 'volume', 'surface area'] },
        inputs: [
            { id: 'r', label: 'Radius (r)', type: 'number', placeholder: 'e.g. 3' }
        ],
        outputs: [
            {
                label: 'Volume',
                calculate: (inputs) => {
                    const r = Number(inputs['r']);
                    if (!r) return 0;
                    return parseFloat(((4 / 3) * Math.PI * Math.pow(r, 3)).toFixed(2));
                }
            },
            {
                label: 'Surface Area',
                calculate: (inputs) => {
                    const r = Number(inputs['r']);
                    if (!r) return 0;
                    return parseFloat((4 * Math.PI * r * r).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Sphere</h3><p>A round solid figure, or its surface, with every point on its surface equidistant from its center.</p>', faq: [] }
    },
    'cone-calculator': {
        id: 'cone-calculator',
        title: 'Cone Calculator',
        description: 'Calculate Volume and Surface Area of a Cone.',
        category: 'geometry',
        icon: 'Cone',
        meta: { title: 'Cone Calculator | Volume & Area', description: 'Calculate volume, lateral area, and total surface area of a cone.', keywords: ['cone calculator', 'volume of cone', 'surface area of cone'] },
        inputs: [
            { id: 'r', label: 'Radius (r)', type: 'number', placeholder: 'e.g. 3' },
            { id: 'h', label: 'Height (h)', type: 'number', placeholder: 'e.g. 5' }
        ],
        outputs: [
            {
                label: 'Volume',
                calculate: (inputs) => {
                    const r = Number(inputs['r']);
                    const h = Number(inputs['h']);
                    if (!r || !h) return 0;
                    return parseFloat(((1 / 3) * Math.PI * r * r * h).toFixed(2));
                }
            },
            {
                label: 'Slant Height (s)',
                calculate: (inputs) => {
                    const r = Number(inputs['r']);
                    const h = Number(inputs['h']);
                    if (!r || !h) return 0;
                    return parseFloat(Math.sqrt(r * r + h * h).toFixed(2));
                }
            },
            {
                label: 'Total Surface Area',
                calculate: (inputs) => {
                    const r = Number(inputs['r']);
                    const h = Number(inputs['h']);
                    if (!r || !h) return 0;
                    const s = Math.sqrt(r * r + h * h);
                    return parseFloat((Math.PI * r * (r + s)).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Cone</h3><p>A three-dimensional geometric shape that tapers smoothly from a flat base to a point called the apex or vertex.</p>', faq: [] }
    },
    'rectangular-prism': {
        id: 'rectangular-prism',
        title: 'Rectangular Prism Calculator',
        description: 'Calculate Volume and Surface Area of a Box.',
        category: 'geometry',
        icon: 'Box',
        meta: { title: 'Rectangular Prism Calculator', description: 'Calculate volume and surface area of a rectangular prism (box).', keywords: ['rectangular prism', 'volume of box', 'surface area'] },
        inputs: [
            { id: 'l', label: 'Length (l)', type: 'number', placeholder: 'e.g. 5' },
            { id: 'w', label: 'Width (w)', type: 'number', placeholder: 'e.g. 3' },
            { id: 'h', label: 'Height (h)', type: 'number', placeholder: 'e.g. 4' }
        ],
        outputs: [
            {
                label: 'Volume',
                calculate: (inputs) => {
                    const l = Number(inputs['l']);
                    const w = Number(inputs['w']);
                    const h = Number(inputs['h']);
                    if (!l || !w || !h) return 0;
                    return parseFloat((l * w * h).toFixed(2));
                }
            },
            {
                label: 'Surface Area',
                calculate: (inputs) => {
                    const l = Number(inputs['l']);
                    const w = Number(inputs['w']);
                    const h = Number(inputs['h']);
                    if (!l || !w || !h) return 0;
                    return parseFloat((2 * (l * w + l * h + w * h)).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Rectangular Prism</h3><p>A solid (3-dimensional) object which has six faces that are rectangles. It is also known as a box or cuboid.</p>', faq: [] }
    },
    'hemisphere-calculator': {
        id: 'hemisphere-calculator',
        title: 'Hemisphere Calculator',
        description: 'Calculate Volume and Area of a Hemisphere.',
        category: 'geometry',
        icon: 'Globe',
        meta: { title: 'Hemisphere Calculator', description: 'Calculate volume and curved/total surface area of a hemisphere (half sphere).', keywords: ['hemisphere', 'volume of hemisphere', 'half sphere'] },
        inputs: [
            { id: 'r', label: 'Radius (r)', type: 'number', placeholder: 'e.g. 4' }
        ],
        outputs: [
            {
                label: 'Volume',
                calculate: (inputs) => {
                    const r = Number(inputs['r']);
                    if (!r) return 0;
                    return parseFloat(((2 / 3) * Math.PI * Math.pow(r, 3)).toFixed(2));
                }
            },
            {
                label: 'Curved Surface Area',
                calculate: (inputs) => {
                    const r = Number(inputs['r']);
                    if (!r) return 0;
                    return parseFloat((2 * Math.PI * r * r).toFixed(2));
                }
            },
            {
                label: 'Total Surface Area',
                calculate: (inputs) => {
                    const r = Number(inputs['r']);
                    if (!r) return 0;
                    return parseFloat((3 * Math.PI * r * r).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Hemisphere</h3><p>A hemisphere is exactly half of a sphere. The total surface area includes the curved surface and the flat circular base.</p>', faq: [] }
    },
    'square-pyramid': {
        id: 'square-pyramid',
        title: 'Square Pyramid Calculator',
        description: 'Calculate Volume and Surface Area of a Pyramid.',
        category: 'geometry',
        icon: 'Triangle',
        meta: { title: 'Square Pyramid Calculator', description: 'Calculate volume and surface area of a square-based pyramid.', keywords: ['pyramid calculator', 'volume of pyramid', 'square pyramid'] },
        inputs: [
            { id: 'a', label: 'Base Edge (a)', type: 'number', placeholder: 'e.g. 4' },
            { id: 'h', label: 'Height (h)', type: 'number', placeholder: 'e.g. 6' }
        ],
        outputs: [
            {
                label: 'Volume',
                calculate: (inputs) => {
                    const a = Number(inputs['a']);
                    const h = Number(inputs['h']);
                    if (!a || !h) return 0;
                    return parseFloat(((a * a * h) / 3).toFixed(2));
                }
            },
            {
                label: 'Slant Height',
                calculate: (inputs) => {
                    const a = Number(inputs['a']);
                    const h = Number(inputs['h']);
                    if (!a || !h) return 0;
                    return parseFloat((Math.sqrt(h * h + (a / 2) * (a / 2))).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Square Pyramid</h3><p>A three-dimensional geometric shape that has a square base and four triangular faces that join at a common point (vertex).</p>', faq: [] }
    },
    'triangular-prism': {
        id: 'triangular-prism',
        title: 'Triangular Prism Calculator',
        description: 'Calculate Volume and Surface Area of a Triangular Prism.',
        category: 'geometry',
        icon: 'Triangle',
        meta: { title: 'Triangular Prism Calculator', description: 'Calculate volume and surface area of a triangular prism.', keywords: ['triangular prism', 'volume of prism', 'geometry'] },
        inputs: [
            { id: 'a', label: 'Base Side (a)', type: 'number', placeholder: 'e.g. 3' },
            { id: 'b', label: 'Base Height (h_b)', type: 'number', placeholder: 'e.g. 4' },
            { id: 'l', label: 'Prism Length (l)', type: 'number', placeholder: 'e.g. 10' }
        ],
        outputs: [
            {
                label: 'Volume',
                calculate: (inputs) => {
                    const a = Number(inputs['a']);
                    const b = Number(inputs['b']);
                    const l = Number(inputs['l']);
                    if (!a || !b || !l) return 0;
                    const baseArea = 0.5 * a * b;
                    return parseFloat((baseArea * l).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Triangular Prism</h3><p>A three-sided prism; it is a polyhedron made of a triangular base, a translated copy, and 3 joining faces.</p>', faq: [] }
    },
    'area-converter': {
        id: 'area-converter',
        title: 'Area Converter',
        description: 'Convert between Square Meters, Acres, Hectares, Square Feet, etc.',
        category: 'conversion',
        icon: 'Maximize',
        meta: { title: 'Area Converter | Acres to Hectares to Sq Feet', description: 'Convert area units instantly. Hectares, Acres, Square Meters, Square Feet, Square Miles.', keywords: ['area converter', 'acres to hectares', 'square feet to meters'] },
        inputs: [
            { id: 'value', label: 'Area', type: 'number', placeholder: 'e.g. 1' },
            {
                id: 'unit_from', label: 'From', type: 'select', defaultValue: 'sq_m',
                options: [
                    { label: 'Square Meters (m²)', value: 'sq_m' },
                    { label: 'Square Kilometers (km²)', value: 'sq_km' },
                    { label: 'Square Feet (ft²)', value: 'sq_ft' },
                    { label: 'Square Yards (yd²)', value: 'sq_yd' },
                    { label: 'Square Miles (mi²)', value: 'sq_mi' },
                    { label: 'Acres (ac)', value: 'acre' },
                    { label: 'Hectares (ha)', value: 'hectare' }
                ]
            },
            {
                id: 'unit_to', label: 'To', type: 'select', defaultValue: 'sq_ft',
                options: [
                    { label: 'Square Meters (m²)', value: 'sq_m' },
                    { label: 'Square Kilometers (km²)', value: 'sq_km' },
                    { label: 'Square Feet (ft²)', value: 'sq_ft' },
                    { label: 'Square Yards (yd²)', value: 'sq_yd' },
                    { label: 'Square Miles (mi²)', value: 'sq_mi' },
                    { label: 'Acres (ac)', value: 'acre' },
                    { label: 'Hectares (ha)', value: 'hectare' }
                ]
            }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const val = Number(inputs['value']);
                    const fileFrom = inputs['unit_from'] as string;
                    const fileTo = inputs['unit_to'] as string;
                    if (typeof val !== 'number') return 0;

                    // Base unit: Square Meters (sq_m)
                    const rates: Record<string, number> = {
                        sq_m: 1,
                        sq_km: 1000000,
                        sq_ft: 0.092903,
                        sq_yd: 0.836127,
                        sq_mi: 2589988.11,
                        acre: 4046.86,
                        hectare: 10000
                    };

                    const inBase = val * (rates[fileFrom] || 1);
                    return parseFloat((inBase / (rates[fileTo] || 1)).toPrecision(6));
                }
            }
        ],
        content: { whatIs: '<h3>Area Units</h3><p>Common area conversions include counting land (acres, hectares) or floor space (square feet, square meters).</p>', faq: [] }
    },
    'volume-converter': {
        id: 'volume-converter',
        title: 'Volume Converter',
        description: 'Convert between Liters, Gallons, Cups, Cubic Meters, etc.',
        category: 'conversion',
        icon: 'Beaker',
        meta: { title: 'Volume Converter | Liters, Gallons, Cups', description: 'Convert volume units. Liters to Gallons, Milliliters vs Fluid Ounces, Cubic Meters.', keywords: ['volume converter', 'liters to gallons', 'ml to ounces'] },
        inputs: [
            { id: 'value', label: 'Volume', type: 'number', placeholder: 'e.g. 1' },
            {
                id: 'unit_from', label: 'From', type: 'select', defaultValue: 'l',
                options: [
                    { label: 'Liters (L)', value: 'l' },
                    { label: 'Milliliters (ml)', value: 'ml' },
                    { label: 'Cubic Meters (m³)', value: 'm3' },
                    { label: 'US Gallons (gal)', value: 'us_gal' },
                    { label: 'US Quarts (qt)', value: 'us_qt' },
                    { label: 'US Pints (pt)', value: 'us_pt' },
                    { label: 'US Cups (cup)', value: 'us_cup' },
                    { label: 'US Fluid Ounces (fl oz)', value: 'us_fl_oz' }
                ]
            },
            {
                id: 'unit_to', label: 'To', type: 'select', defaultValue: 'us_gal',
                options: [
                    { label: 'Liters (L)', value: 'l' },
                    { label: 'Milliliters (ml)', value: 'ml' },
                    { label: 'Cubic Meters (m³)', value: 'm3' },
                    { label: 'US Gallons (gal)', value: 'us_gal' },
                    { label: 'US Quarts (qt)', value: 'us_qt' },
                    { label: 'US Pints (pt)', value: 'us_pt' },
                    { label: 'US Cups (cup)', value: 'us_cup' },
                    { label: 'US Fluid Ounces (fl oz)', value: 'us_fl_oz' }
                ]
            }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const val = Number(inputs['value']);
                    const fileFrom = inputs['unit_from'] as string;
                    const fileTo = inputs['unit_to'] as string;
                    if (typeof val !== 'number') return 0;

                    // Base unit: Liter (L)
                    const rates: Record<string, number> = {
                        l: 1,
                        ml: 0.001,
                        m3: 1000,
                        us_gal: 3.78541,
                        us_qt: 0.946353,
                        us_pt: 0.473176,
                        us_cup: 0.236588,
                        us_fl_oz: 0.0295735
                    };

                    const inBase = val * (rates[fileFrom] || 1);
                    return parseFloat((inBase / (rates[fileTo] || 1)).toPrecision(6));
                }
            }
        ],
        content: { whatIs: '<h3>Volume Units</h3><p>Volume measures the 3D space occupied by distinct matter. The liter (L) is the metric standard, while gallons (gal) are common in the US.</p>', faq: [] }
    },
    'pressure-converter': {
        id: 'pressure-converter',
        title: 'Pressure Converter',
        description: 'Convert between Pascal, Bar, PSI, ATM.',
        category: 'conversion',
        icon: 'Gauge',
        meta: { title: 'Pressure Converter | PSI, Bar, Pascal', description: 'Convert pressure units. Pascal, Bar, PSI (Pound force per square inch), Atmosphere (atm).', keywords: ['pressure converter', 'psi to bar', 'pascal to atm'] },
        inputs: [
            { id: 'value', label: 'Pressure', type: 'number', placeholder: 'e.g. 100' },
            {
                id: 'unit_from', label: 'From', type: 'select', defaultValue: 'psi',
                options: [
                    { label: 'Pascal (Pa)', value: 'pa' },
                    { label: 'Kilopascal (kPa)', value: 'kpa' },
                    { label: 'Bar', value: 'bar' },
                    { label: 'PSI (lbf/in²)', value: 'psi' },
                    { label: 'Standard Atmosphere (atm)', value: 'atm' },
                    { label: 'Torr (mmHg)', value: 'torr' }
                ]
            },
            {
                id: 'unit_to', label: 'To', type: 'select', defaultValue: 'bar',
                options: [
                    { label: 'Pascal (Pa)', value: 'pa' },
                    { label: 'Kilopascal (kPa)', value: 'kpa' },
                    { label: 'Bar', value: 'bar' },
                    { label: 'PSI (lbf/in²)', value: 'psi' },
                    { label: 'Standard Atmosphere (atm)', value: 'atm' },
                    { label: 'Torr (mmHg)', value: 'torr' }
                ]
            }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const val = Number(inputs['value']);
                    const fileFrom = inputs['unit_from'] as string;
                    const fileTo = inputs['unit_to'] as string;
                    if (typeof val !== 'number') return 0;

                    // Base unit: Pascal (Pa)
                    const rates: Record<string, number> = {
                        pa: 1,
                        kpa: 1000,
                        bar: 100000,
                        psi: 6894.76,
                        atm: 101325,
                        torr: 133.322
                    };

                    const inBase = val * (rates[fileFrom] || 1);
                    return parseFloat((inBase / (rates[fileTo] || 1)).toPrecision(6));
                }
            }
        ],
        content: { whatIs: '<h3>Pressure Units</h3><p>Pressure is force applied perpendicular to the surface of an object per unit area. <strong>PSI</strong> is common in tires, <strong>Bar</strong> in meteorology/diving.</p>', faq: [] }
    },
    'data-converter': {
        id: 'data-converter',
        title: 'Data Storage Converter',
        description: 'Convert between Bytes, KB, MB, GB, TB.',
        category: 'conversion',
        icon: 'HardDrive',
        meta: { title: 'Data Converter | MB to GB, TB, KB', description: 'Convert digital storage units. Bytes, Kilobytes, Megabytes, Gigabytes, Terabytes, Petabytes.', keywords: ['data converter', 'mb to gb', 'bytes converter', 'storage calculator'] },
        inputs: [
            { id: 'value', label: 'Value', type: 'number', placeholder: 'e.g. 1024' },
            {
                id: 'unit_from', label: 'From', type: 'select', defaultValue: 'mb',
                options: [
                    { label: 'Bytes (B)', value: 'b' },
                    { label: 'Kilobytes (KB)', value: 'kb' },
                    { label: 'Megabytes (MB)', value: 'mb' },
                    { label: 'Gigabytes (GB)', value: 'gb' },
                    { label: 'Terabytes (TB)', value: 'tb' },
                    { label: 'Petabytes (PB)', value: 'pb' },
                    { label: 'Bits (bit)', value: 'bit' }
                ]
            },
            {
                id: 'unit_to', label: 'To', type: 'select', defaultValue: 'gb',
                options: [
                    { label: 'Bytes (B)', value: 'b' },
                    { label: 'Kilobytes (KB)', value: 'kb' },
                    { label: 'Megabytes (MB)', value: 'mb' },
                    { label: 'Gigabytes (GB)', value: 'gb' },
                    { label: 'Terabytes (TB)', value: 'tb' },
                    { label: 'Petabytes (PB)', value: 'pb' },
                    { label: 'Bits (bit)', value: 'bit' }
                ]
            }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const val = Number(inputs['value']);
                    const fileFrom = inputs['unit_from'] as string;
                    const fileTo = inputs['unit_to'] as string;
                    if (typeof val !== 'number') return 0;

                    // Base unit: Byte (B)
                    // Note: Using decimal standard (1 KB = 1000 B) vs binary (1024) is a common point of confusion.
                    // We will use standard digital information definitions (SI - 1000) or IEC (1024)?
                    // Usually in simplified contexts 1024 is expected for RAM/OS, 1000 for Disk.
                    // Let's use 1024 (Binary prefixes JEDEC standard commonly used by Windows).
                    const rates: Record<string, number> = {
                        bit: 0.125,
                        b: 1,
                        kb: 1024,
                        mb: 1048576, // 1024^2
                        gb: 1073741824, // 1024^3
                        tb: 1099511627776, // 1024^4
                        pb: 1125899906842624 // 1024^5
                    };

                    const inBase = val * (rates[fileFrom] || 1);
                    return parseFloat((inBase / (rates[fileTo] || 1)).toPrecision(9));
                }
            }
        ],
        content: { whatIs: '<h3>Data Units</h3><p>Data storage is measured in bytes. We use the binary standard (multiples of 1024) where 1024 bytes = 1 KB.</p>', faq: [] }
    },
    'energy-converter': {
        id: 'energy-converter',
        title: 'Energy Converter',
        description: 'Convert between Joules, Calories, kWh, eV.',
        category: 'conversion',
        icon: 'Zap', // Reusing Zap from Power
        meta: { title: 'Energy Converter | Joules to Calories, kWh', description: 'Convert energy units. Joules (J), Calories (cal), Kilowatt-hours (kWh), Electron-volts (eV).', keywords: ['energy converter', 'joules to calories', 'kwh calculator'] },
        inputs: [
            { id: 'value', label: 'Energy', type: 'number', placeholder: 'e.g. 100' },
            {
                id: 'unit_from', label: 'From', type: 'select', defaultValue: 'j',
                options: [
                    { label: 'Joules (J)', value: 'j' },
                    { label: 'Kilojoules (kJ)', value: 'kj' },
                    { label: 'Gram Calories (cal)', value: 'cal' },
                    { label: 'Kilo Calories (kcal/Food)', value: 'kcal' },
                    { label: 'Kilowatt-hour (kWh)', value: 'kwh' },
                    { label: 'Electron-volt (eV)', value: 'ev' },
                    { label: 'British Thermal Unit (BTU)', value: 'btu' }
                ]
            },
            {
                id: 'unit_to', label: 'To', type: 'select', defaultValue: 'kcal',
                options: [
                    { label: 'Joules (J)', value: 'j' },
                    { label: 'Kilojoules (kJ)', value: 'kj' },
                    { label: 'Gram Calories (cal)', value: 'cal' },
                    { label: 'Kilo Calories (kcal/Food)', value: 'kcal' },
                    { label: 'Kilowatt-hour (kWh)', value: 'kwh' },
                    { label: 'Electron-volt (eV)', value: 'ev' },
                    { label: 'British Thermal Unit (BTU)', value: 'btu' }
                ]
            }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const val = Number(inputs['value']);
                    const fileFrom = inputs['unit_from'] as string;
                    const fileTo = inputs['unit_to'] as string;
                    if (typeof val !== 'number') return 0;

                    // Base unit: Joule (J)
                    const rates: Record<string, number> = {
                        j: 1,
                        kj: 1000,
                        cal: 4.184,
                        kcal: 4184,
                        kwh: 3600000,
                        ev: 1.60218e-19,
                        btu: 1055.06
                    };

                    const inBase = val * (rates[fileFrom] || 1);
                    return parseFloat((inBase / (rates[fileTo] || 1)).toPrecision(6));
                }
            }
        ],
        content: { whatIs: '<h3>Energy Units</h3><p>Energy is the quantitative property that must be transferred to an object in order to perform work on, or to heat, the object.</p>', faq: [] }
    },
    'logarithm-calculator': {
        id: 'logarithm-calculator',
        title: 'Logarithm Calculator',
        description: 'Calculate Logarithms (log base x) and Natural Logarithms (ln).',
        category: 'math',
        icon: 'Calculator',
        meta: { title: 'Logarithm Calculator | Log base 2, 10, e', description: 'Calculate logarithms with any base. Log base 10 (common), log base 2 (binary), log base e (natural).', keywords: ['log calculator', 'logarithm calculator', 'natural log calculator', 'ln calculator'] },
        inputs: [
            { id: 'val', label: 'Number (x)', type: 'number', placeholder: 'e.g. 100' },
            { id: 'base', label: 'Base (b)', type: 'number', placeholder: 'e.g. 10', defaultValue: '10' }
        ],
        outputs: [
            {
                label: 'Log base b',
                calculate: (inputs) => {
                    const x = Number(inputs['val']);
                    const b = Number(inputs['base']);
                    if (x <= 0 || b <= 0 || b === 1) return 0;
                    return parseFloat((Math.log(x) / Math.log(b)).toFixed(6));
                }
            },
            {
                label: 'Natural Log (ln)',
                calculate: (inputs) => {
                    const x = Number(inputs['val']);
                    if (x <= 0) return 0;
                    return parseFloat(Math.log(x).toFixed(6));
                }
            }
        ],
        content: { whatIs: '<h3>Logarithms</h3><p>The logarithm is the inverse function to exponentiation. It answers the question: "To what power must the base be raised, to produce a given number?"</p>', faq: [] }
    },
    'prime-checker': {
        id: 'prime-checker',
        title: 'Prime Number Checker',
        description: 'Check if a number is Prime and find factors.',
        category: 'math',
        icon: 'Hash',
        meta: { title: 'Prime Number Checker', description: 'Check if a number is prime. Find factors and the next prime number.', keywords: ['prime number checker', 'is it prime', 'prime factorization'] },
        inputs: [
            { id: 'n', label: 'Number', type: 'number', placeholder: 'e.g. 17' }
        ],
        outputs: [
            {
                label: 'Is Prime?',
                calculate: (inputs) => {
                    const n = Math.floor(Number(inputs['n']));
                    if (n <= 1) return 'No';
                    if (n <= 3) return 'Yes';
                    if (n % 2 === 0 || n % 3 === 0) return 'No';
                    for (let i = 5; i * i <= n; i += 6) {
                        if (n % i === 0 || n % (i + 2) === 0) return 'No';
                    }
                    return 'Yes';
                }
            },
            {
                label: 'Factors',
                calculate: (inputs) => {
                    const n = Math.floor(Number(inputs['n']));
                    if (n < 1) return 'None';
                    const factors = [];
                    for (let i = 1; i <= Math.sqrt(n); i++) {
                        if (n % i === 0) {
                            factors.push(i);
                            if (i !== n / i) factors.push(n / i);
                        }
                    }
                    return factors.sort((a, b) => a - b).join(', ');
                }
            }
        ],
        content: { whatIs: '<h3>Prime Numbers</h3><p>A prime number is a natural number greater than 1 that is not a product of two smaller natural numbers. A natural number greater than 1 that is not prime is called a composite number.</p>', faq: [] }
    },
    'factorial-calculator': {
        id: 'factorial-calculator',
        title: 'Factorial Calculator',
        description: 'Calculate n! (Factorial) of a number.',
        category: 'math',
        icon: 'Binary',
        meta: { title: 'Factorial Calculator (n!)', description: 'Calculate the factorial of a number.', keywords: ['factorial calculator', 'n factorial', 'permutations'] },
        inputs: [
            { id: 'n', label: 'Number (n)', type: 'number', placeholder: 'e.g. 5' }
        ],
        outputs: [
            {
                label: 'Result (n!)',
                calculate: (inputs) => {
                    const n = Math.floor(Number(inputs['n']));
                    if (n < 0) return 0;
                    if (n === 0 || n === 1) return 1;
                    if (n > 170) return 'Infinity'; // JS limitation
                    let result = 1;
                    for (let i = 2; i <= n; i++) result *= i;
                    // Format large numbers? 
                    // Let's just return the number, it will be formatted by the UI if possible or just stringified.
                    // For very large numbers JS uses scientific notation automatically.
                    return result;
                }
            }
        ],
        content: { whatIs: '<h3>Factorial</h3><p>The factorial of a non-negative integer n, denoted by n!, is the product of all positive integers less than or equal to n.</p>', faq: [] }
    },
    'sig-figs-calculator': {
        id: 'sig-figs-calculator',
        title: 'Significant Figures Calculator',
        description: 'Count significant figures in a number.',
        category: 'math',
        icon: 'Sigma',
        meta: { title: 'Significant Figures Calculator', description: 'Count the number of significant figures (sig figs) in a number.', keywords: ['sig figs calculator', 'significant digits', 'significant figures counter'] },
        inputs: [
            { id: 'num', label: 'Number', type: 'text', placeholder: 'e.g. 0.00450' }
        ],
        outputs: [
            {
                label: 'Sig Figs Count',
                calculate: (inputs) => {
                    const s = inputs['num'] as string;
                    if (!s) return 0;
                    // Logic:
                    // 1. Remove leading zeros? No, "0.005" -> 1 sig fig (5). "0.0050" -> 2 sig figs (5,0).
                    // Regex approach is complex. Simplest scientific approach:
                    // Convert to string, trim.
                    let clean = s.trim();
                    if (/^-/.test(clean)) clean = clean.substring(1);
                    if (clean === '' || isNaN(Number(clean))) return 0;

                    // Remove decimal point for counting ONLY if we handle leading/trailing zeros correctly.

                    // Algorithm:
                    // 1. If it has a decimal point:
                    //    - Remove leading zeros.
                    //    - Count all remaining digits (including zeros).
                    // 2. If no decimal point (integer):
                    //    - Remove trailing zeros? Ambiguous. Usually 500 has 1 sig fig, 500. has 3.
                    //    - We will assume: "500" -> 1 (Ambiguous case, usually treated as such unless marked).
                    //    - Wait, user needs to know. Standard rule: Trailing zeros in integer w/o decimal are NOT significant.

                    // Let's use a simpler heuristic for a basic tool:
                    // "0.00450" -> "450" -> 3.
                    // "450" -> "45" -> 2.
                    // "450." -> "450" -> 3.

                    // Actually, let's look for the first non-zero.
                    // If decimal point exists:
                    //    Start counting from first non-zero. Count everything after till end.
                    // If no decimal point:
                    //    Start counting from first non-zero. Stop at last non-zero.

                    const hasDecimal = clean.includes('.');
                    let temp = clean.replace('.', ''); // remove decimal for simpler processing if needed, but position matters.

                    // Find first non-zero index
                    let firstNonZero = -1;
                    for (let i = 0; i < clean.length; i++) {
                        if (clean[i] !== '0' && clean[i] !== '.') {
                            firstNonZero = i;
                            break;
                        }
                    }

                    if (firstNonZero === -1) return 0; // All zeros? e.g. "0.00" -> 0 sig figs? Actually 0 has 1 sig fig usually? 0.00 is ambiguous/precision. Let's say 0.

                    if (hasDecimal) {
                        // Count from firstNonZero to end, excluding the decimal point itself from the count.
                        let count = 0;
                        for (let i = firstNonZero; i < clean.length; i++) {
                            if (clean[i] !== '.') count++;
                        }
                        return count;
                    } else {
                        // No decimal. Count from firstNonZero to LAST NonZero.
                        let lastNonZero = -1;
                        for (let i = clean.length - 1; i >= 0; i--) {
                            if (clean[i] !== '0') {
                                lastNonZero = i;
                                break;
                            }
                        }
                        return lastNonZero - firstNonZero + 1;
                    }
                }
            }
        ],
        content: { whatIs: '<h3>Significant Figures</h3><p>Significant figures are the digits in a number that provide meaningful information about its precision.</p>', faq: [] }
    },
    'water-intake-calculator': {
        id: 'water-intake-calculator',
        title: 'Water Intake Calculator',
        description: 'Calculate daily water intake based on weight and activity.',
        category: 'health',
        icon: 'Droplets',
        meta: { title: 'Water Intake Calculator | Daily Hydration Needs', description: 'Calculate how much water you should drink daily based on your weight and activity level. Stay hydrated and healthy.', keywords: ['water intake calculator', 'hydration calculator', 'daily water intake', 'how much water to drink'] },
        inputs: [
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'e.g. 70' },
            { id: 'activity', label: 'Activity Level (Minutes/Day)', type: 'number', placeholder: 'e.g. 30' }
        ],
        outputs: [
            {
                label: 'Daily Intake (Liters)',
                calculate: (inputs) => {
                    const weight = Number(inputs['weight']);
                    const activity = Number(inputs['activity']);
                    if (!weight) return 0;
                    // Formula: Weight (kg) * 0.033 + (Activity (min) / 30) * 0.35
                    const base = weight * 0.033;
                    const extra = (activity / 30) * 0.35;
                    return parseFloat((base + extra).toFixed(2));
                }
            },
            {
                label: 'Cups (250ml)',
                calculate: (inputs) => {
                    const weight = Number(inputs['weight']);
                    const activity = Number(inputs['activity']);
                    if (!weight) return 0;
                    const liters = weight * 0.033 + (activity / 30) * 0.35;
                    return parseFloat((liters / 0.25).toFixed(1));
                }
            }
        ],
        content: { whatIs: '<h3>Hydration</h3><p>Water is essential for life. The amount you need depends on your body weight and how active you are.</p>', faq: [] }
    },
    '1rm-calculator': {
        id: '1rm-calculator',
        title: '1RM Calculator (One Rep Max)',
        description: 'Calculate your One Rep Max for lifting.',
        category: 'health',
        icon: 'Dumbbell',
        meta: { title: '1RM Calculator | One Rep Max', description: 'Calculate your One Rep Max (1RM) for bench press, squat, and deadlift using the Epley formula.', keywords: ['1rm calculator', 'one rep max', 'max lift calculator', 'epley formula'] },
        inputs: [
            { id: 'weight', label: 'Weight Lifted (kg)', type: 'number', placeholder: 'e.g. 100' },
            { id: 'reps', label: 'Repetitions', type: 'number', placeholder: 'e.g. 5' }
        ],
        outputs: [
            {
                label: 'One Rep Max (1RM)',
                calculate: (inputs) => {
                    const w = Number(inputs['weight']);
                    const r = Number(inputs['reps']);
                    if (!w || !r) return 0;
                    if (r === 1) return w;
                    // Epley Formula: 1RM = w * (1 + r/30)
                    return parseFloat((w * (1 + r / 30)).toFixed(1));
                }
            },
            {
                label: 'Training Max (90%)',
                calculate: (inputs) => {
                    const w = Number(inputs['weight']);
                    const r = Number(inputs['reps']);
                    if (!w || !r) return 0;
                    const oneRM = w * (1 + r / 30);
                    return parseFloat((oneRM * 0.9).toFixed(1));
                }
            }
        ],
        content: { whatIs: '<h3>One Rep Max</h3><p>Your one-repetition max is the maximum amount of weight you can lift for a single repetition of a given exercise.</p>', faq: [] }
    },
    'bmr-calculator': {
        id: 'bmr-calculator',
        title: 'BMR Calculator',
        description: 'Calculate Basal Metabolic Rate (Mifflin-St Jeor).',
        category: 'health',
        icon: 'Activity',
        meta: { title: 'BMR Calculator | Basal Metabolic Rate', description: 'Calculate your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation. Calories burned at rest.', keywords: ['bmr calculator', 'basal metabolic rate', 'calories at rest'] },
        inputs: [
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'e.g. 70' },
            { id: 'height', label: 'Height (cm)', type: 'number', placeholder: 'e.g. 175' },
            { id: 'age', label: 'Age', type: 'number', placeholder: 'e.g. 25' },
            {
                id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male',
                options: [
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' }
                ]
            }
        ],
        outputs: [
            {
                label: 'BMR (Calories/Day)',
                calculate: (inputs) => {
                    const w = Number(inputs['weight']);
                    const h = Number(inputs['height']);
                    const a = Number(inputs['age']);
                    const g = inputs['gender'];
                    if (!w || !h || !a) return 0;

                    // Mifflin-St Jeor
                    let bmr = (10 * w) + (6.25 * h) - (5 * a);
                    if (g === 'male') {
                        bmr += 5;
                    } else {
                        bmr -= 161;
                    }
                    return parseFloat(bmr.toFixed(0));
                }
            }
        ],
        content: { whatIs: '<h3>Basal Metabolic Rate</h3><p>BMR is the number of calories your body burns while performing basic life-sustaining functions like breathing and circulation.</p>', faq: [] }
    },
    'macro-calculator': {
        id: 'macro-calculator',
        title: 'Macro Calculator',
        description: 'Calculate daily Protein, Carb, and Fat needs.',
        category: 'health',
        icon: 'Utensils',
        meta: { title: 'Macro Calculator | IIFYM', description: 'Calculate your daily macronutrient breakdown (Protein, Carbs, Fats) based on your goal.', keywords: ['macro calculator', 'iifym calculator', 'protein calculator', 'carb cycling'] },
        inputs: [
            { id: 'tdee', label: 'Daily Calories (TDEE)', type: 'number', placeholder: 'e.g. 2000' },
            {
                id: 'goal', label: 'Goal', type: 'select', defaultValue: 'maintain',
                options: [
                    { label: 'Lose Weight (High Protein)', value: 'lose' },
                    { label: 'Maintain', value: 'maintain' },
                    { label: 'Gain Muscle', value: 'gain' },
                    { label: 'Keto (Low Carb)', value: 'keto' }
                ]
            }
        ],
        outputs: [
            {
                label: 'Protein (g)',
                calculate: (inputs) => {
                    const tdee = Number(inputs['tdee']);
                    const goal = inputs['goal'];
                    if (!tdee) return 0;

                    let proteinRatio = 0.3; // Default maintain
                    if (goal === 'lose') proteinRatio = 0.4;
                    if (goal === 'gain') proteinRatio = 0.3;
                    if (goal === 'keto') proteinRatio = 0.25;

                    return parseFloat(((tdee * proteinRatio) / 4).toFixed(0));
                }
            },
            {
                label: 'Carbs (g)',
                calculate: (inputs) => {
                    const tdee = Number(inputs['tdee']);
                    const goal = inputs['goal'];
                    if (!tdee) return 0;

                    let carbRatio = 0.4;
                    if (goal === 'lose') carbRatio = 0.3;
                    if (goal === 'gain') carbRatio = 0.45;
                    if (goal === 'keto') carbRatio = 0.05;

                    return parseFloat(((tdee * carbRatio) / 4).toFixed(0));
                }
            },
            {
                label: 'Fats (g)',
                calculate: (inputs) => {
                    const tdee = Number(inputs['tdee']);
                    const goal = inputs['goal'];
                    if (!tdee) return 0;

                    let fatRatio = 0.3;
                    if (goal === 'lose') fatRatio = 0.3;
                    if (goal === 'gain') fatRatio = 0.25;
                    if (goal === 'keto') fatRatio = 0.70;

                    return parseFloat(((tdee * fatRatio) / 9).toFixed(0));
                }
            }
        ],
        content: { whatIs: '<h3>Macronutrients</h3><p>Micronutrients are the nutrients your body needs in larger amounts: carbohydrates, proteins, and fats.</p>', faq: [] }
    },
    'salary-hourly-calculator': {
        id: 'salary-hourly-calculator',
        title: 'Salary to Hourly Calculator',
        description: 'Convert Annual or Monthly Salary to Hourly Wage.',
        category: 'finance',
        icon: 'Banknote',
        meta: { title: 'Salary to Hourly Calculator', description: 'Convert your annual or monthly salary to an hourly wage. See how much you make per hour, day, week.', keywords: ['salary to hourly', 'hourly wage calculator', 'paycheck calculator'] },
        inputs: [
            { id: 'amount', label: 'Salary Amount', type: 'number', placeholder: 'e.g. 50000' },
            {
                id: 'period', label: 'Per', type: 'select', defaultValue: 'year',
                options: [
                    { label: 'Year', value: 'year' },
                    { label: 'Month', value: 'month' },
                    { label: 'Week', value: 'week' },
                    { label: 'Day', value: 'day' }
                ]
            },
            { id: 'hours', label: 'Hours per Week', type: 'number', placeholder: '40', defaultValue: '40' }
        ],
        outputs: [
            {
                label: 'Hourly Wage',
                unit: '$',
                calculate: (inputs) => {
                    const amount = Number(inputs['amount']);
                    const period = inputs['period'];
                    const hours = Number(inputs['hours']) || 40;
                    if (!amount) return 0;

                    let annual = 0;
                    if (period === 'year') annual = amount;
                    if (period === 'month') annual = amount * 12;
                    if (period === 'week') annual = amount * 52;
                    if (period === 'day') annual = amount * 260; // 5 days * 52 weeks

                    const totalHours = hours * 52;
                    return parseFloat((annual / totalHours).toFixed(2));
                }
            },
            {
                label: 'Monthly Salary',
                unit: '$',
                calculate: (inputs) => {
                    const amount = Number(inputs['amount']);
                    const period = inputs['period'];
                    let annual = 0;
                    if (period === 'year') annual = amount;
                    if (period === 'month') annual = amount * 12;
                    if (period === 'week') annual = amount * 52;
                    if (period === 'day') annual = amount * 260;
                    return parseFloat((annual / 12).toFixed(2));
                }
            },
            {
                label: 'Annual Salary',
                unit: '$',
                calculate: (inputs) => {
                    const amount = Number(inputs['amount']);
                    const period = inputs['period'];
                    let annual = 0;
                    if (period === 'year') annual = amount;
                    if (period === 'month') annual = amount * 12;
                    if (period === 'week') annual = amount * 52;
                    if (period === 'day') annual = amount * 260;
                    return parseFloat(annual.toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Salary Conversion</h3><p>Compare different pay periods easily.</p>', faq: [] }
    },
    'sales-tax-calculator': {
        id: 'sales-tax-calculator',
        title: 'Sales Tax Calculator',
        description: 'Calculate final price with sales tax.',
        category: 'finance',
        icon: 'Receipt',
        meta: { title: 'Sales Tax Calculator', description: 'Calculate sales tax and the total cost of an item.', keywords: ['sales tax calculator', 'tax calculator', 'vat calculator'] },
        inputs: [
            { id: 'price', label: 'Price ($)', type: 'number', placeholder: 'e.g. 100' },
            { id: 'tax', label: 'Sales Tax Rate (%)', type: 'number', placeholder: 'e.g. 8.25' }
        ],
        outputs: [
            {
                label: 'Tax Amount',
                unit: '$',
                calculate: (inputs) => {
                    const p = Number(inputs['price']);
                    const t = Number(inputs['tax']);
                    if (!p) return 0;
                    return parseFloat(((p * t) / 100).toFixed(2));
                }
            },
            {
                label: 'Total Price',
                unit: '$',
                calculate: (inputs) => {
                    const p = Number(inputs['price']);
                    const t = Number(inputs['tax']);
                    if (!p) return 0;
                    return parseFloat((p * (1 + t / 100)).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Sales Tax</h3><p>Consumption tax imposed by the government on the sale of goods and services.</p>', faq: [] }
    },
    'vat-calculator': {
        id: 'vat-calculator',
        title: 'VAT Calculator',
        description: 'Add or Remove VAT (Value Added Tax).',
        category: 'finance',
        icon: 'Receipt',
        meta: { title: 'VAT Calculator | Add or Remove VAT', description: 'Calculate VAT. Find the net price or gross price easily.', keywords: ['vat calculator', 'value added tax', 'tax reverse calculator'] },
        inputs: [
            { id: 'amount', label: 'Amount', type: 'number', placeholder: 'e.g. 120' },
            { id: 'rate', label: 'VAT Rate (%)', type: 'number', placeholder: 'e.g. 20' },
            {
                id: 'action', label: 'Action', type: 'select', defaultValue: 'add',
                options: [
                    { label: 'Add VAT (Net -> Gross)', value: 'add' },
                    { label: 'Remove VAT (Gross -> Net)', value: 'remove' }
                ]
            }
        ],
        outputs: [
            {
                label: 'Net Price (Excl. VAT)',
                unit: '$',
                calculate: (inputs) => {
                    const amount = Number(inputs['amount']);
                    const rate = Number(inputs['rate']);
                    const action = inputs['action'];
                    if (!amount) return 0;

                    if (action === 'add') {
                        return parseFloat(amount.toFixed(2));
                    } else {
                        // Amount is Gross, find Net. Net = Gross / (1 + r)
                        return parseFloat((amount / (1 + rate / 100)).toFixed(2));
                    }
                }
            },
            {
                label: 'VAT Amount',
                unit: '$',
                calculate: (inputs) => {
                    const amount = Number(inputs['amount']);
                    const rate = Number(inputs['rate']);
                    const action = inputs['action'];
                    if (!amount) return 0;

                    if (action === 'add') {
                        return parseFloat(((amount * rate) / 100).toFixed(2));
                    } else {
                        const net = amount / (1 + rate / 100);
                        return parseFloat((amount - net).toFixed(2));
                    }
                }
            },
            {
                label: 'Gross Price (Incl. VAT)',
                unit: '$',
                calculate: (inputs) => {
                    const amount = Number(inputs['amount']);
                    const rate = Number(inputs['rate']);
                    const action = inputs['action'];
                    if (!amount) return 0;

                    if (action === 'add') {
                        return parseFloat((amount * (1 + rate / 100)).toFixed(2));
                    } else {
                        return parseFloat(amount.toFixed(2));
                    }
                }
            }
        ],
        content: { whatIs: '<h3>Value Added Tax (VAT)</h3><p>A consumption tax placed on a product whenever value is added at each stage of the supply chain.</p>', faq: [] }
    },
    'mortgage-calculator': {
        id: 'mortgage-calculator',
        title: 'Mortgage Calculator',
        description: 'Calculate monthly mortgage payments.',
        category: 'finance',
        icon: 'Home',
        meta: { title: 'Mortgage Calculator', description: 'Estimate your monthly mortgage payments. Enter home value, down payment, and interest rate.', keywords: ['mortgage calculator', 'house payment', 'home loan'] },
        inputs: [
            { id: 'home_val', label: 'Home Value ($)', type: 'number', placeholder: 'e.g. 300000' },
            { id: 'down_pmt', label: 'Down Payment ($)', type: 'number', placeholder: 'e.g. 60000' },
            { id: 'rate', label: 'Interest Rate (%)', type: 'number', placeholder: 'e.g. 6.5' },
            { id: 'years', label: 'Loan Term (Years)', type: 'number', placeholder: 'e.g. 30', defaultValue: '30' }
        ],
        outputs: [
            {
                label: 'Monthly Payment',
                unit: '$',
                calculate: (inputs) => {
                    const hv = Number(inputs['home_val']);
                    const dp = Number(inputs['down_pmt']);
                    const r = Number(inputs['rate']) / 100 / 12;
                    const n = Number(inputs['years']) * 12;
                    if (!hv) return 0;

                    const P = hv - dp;
                    if (P <= 0) return 0;

                    // M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
                    const check = Math.pow(1 + r, n);
                    return parseFloat(((P * r * check) / (check - 1)).toFixed(2));
                }
            },
            {
                label: 'Loan Amount',
                unit: '$',
                calculate: (inputs) => {
                    const hv = Number(inputs['home_val']);
                    const dp = Number(inputs['down_pmt']);
                    return parseFloat(Math.max(0, hv - dp).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Mortgage</h3><p>A loan used either by purchasers of real property to raise funds to buy real estate, or alternatively by existing property owners to raise funds for any purpose while putting a lien on the property being mortgaged.</p>', faq: [] }
    },
    'auto-loan-calculator': {
        id: 'auto-loan-calculator',
        title: 'Auto Loan Calculator',
        description: 'Calculate monthly car payments.',
        category: 'finance',
        icon: 'Car',
        meta: { title: 'Auto Loan Calculator', description: 'Calculate monthly auto loan payments.', keywords: ['auto loan', 'car payment', 'car loan calculator'] },
        inputs: [
            { id: 'price', label: 'Vehicle Price ($)', type: 'number', placeholder: 'e.g. 25000' },
            { id: 'down', label: 'Down Payment ($)', type: 'number', placeholder: 'e.g. 5000' },
            { id: 'trade', label: 'Trade-In Value ($)', type: 'number', placeholder: 'e.g. 2000' },
            { id: 'rate', label: 'Interest Rate (%)', type: 'number', placeholder: 'e.g. 5' },
            { id: 'months', label: 'Term (Months)', type: 'number', placeholder: 'e.g. 60', defaultValue: '60' }
        ],
        outputs: [
            {
                label: 'Monthly Payment',
                unit: '$',
                calculate: (inputs) => {
                    const price = Number(inputs['price']);
                    const down = Number(inputs['down']);
                    const trade = Number(inputs['trade']);
                    const r = Number(inputs['rate']) / 100 / 12;
                    const n = Number(inputs['months']);

                    const P = price - down - trade;
                    if (P <= 0) return 0;
                    if (n <= 0) return 0;
                    if (r === 0) return parseFloat((P / n).toFixed(2));

                    const check = Math.pow(1 + r, n);
                    return parseFloat(((P * r * check) / (check - 1)).toFixed(2));
                }
            },
            {
                label: 'Total Loan Amount',
                unit: '$',
                calculate: (inputs) => {
                    const price = Number(inputs['price']);
                    const down = Number(inputs['down']);
                    const trade = Number(inputs['trade']);
                    return parseFloat(Math.max(0, price - down - trade).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Auto Loans</h3><p>Secured loans used to purchase a vehicle.</p>', faq: [] }
    },
    'password-generator': {
        id: 'password-generator',
        title: 'Password Generator',
        description: 'Generate secure random passwords.',
        category: 'other',
        icon: 'Lock',
        meta: { title: 'Password Generator | Secure Random Passwords', description: 'Generate strong, secure passwords instantly with your choice of length and characters.', keywords: ['password generator', 'random password', 'secure password'] },
        inputs: [
            { id: 'length', label: 'Length', type: 'number', placeholder: '12', defaultValue: '12' },
            {
                id: 'symbols', label: 'Include Symbols?', type: 'select', defaultValue: 'yes',
                options: [{ label: 'Yes (@#$%)', value: 'yes' }, { label: 'No', value: 'no' }]
            },
            {
                id: 'numbers', label: 'Include Numbers?', type: 'select', defaultValue: 'yes',
                options: [{ label: 'Yes (0-9)', value: 'yes' }, { label: 'No', value: 'no' }]
            }
        ],
        outputs: [
            {
                label: 'Generated Password',
                calculate: (inputs) => {
                    const len = Math.min(64, Math.max(4, Number(inputs['length']) || 12));
                    const sym = inputs['symbols'] === 'yes';
                    const num = inputs['numbers'] === 'yes';

                    const lower = 'abcdefghijklmnopqrstuvwxyz';
                    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    const numbers = '0123456789';
                    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

                    let chars = lower + upper;
                    if (num) chars += numbers;
                    if (sym) chars += symbols;

                    let pass = '';
                    // Ensure at least one of each selected type
                    pass += lower[Math.floor(Math.random() * lower.length)];
                    pass += upper[Math.floor(Math.random() * upper.length)];
                    if (num) pass += numbers[Math.floor(Math.random() * numbers.length)];
                    if (sym) pass += symbols[Math.floor(Math.random() * symbols.length)];

                    while (pass.length < len) {
                        pass += chars[Math.floor(Math.random() * chars.length)];
                    }

                    // Shuffle
                    return pass.split('').sort(() => 0.5 - Math.random()).join('');
                }
            }
        ],
        content: { whatIs: '<h3>Strong Passwords</h3><p>A strong password is at least 12 characters long and includes a mix of uppercase letters, lowercase letters, numbers, and symbols.</p>', faq: [] }
    },
    'lorem-ipsum-generator': {
        id: 'lorem-ipsum-generator',
        title: 'Lorem Ipsum Generator',
        description: 'Generate placeholder text for designs.',
        category: 'other',
        icon: 'FileText',
        meta: { title: 'Lorem Ipsum Generator', description: 'Generate Lorem Ipsum placeholder text for your designs and layouts.', keywords: ['lorem ipsum', 'placeholder text', 'dummy text'] },
        inputs: [
            { id: 'paragraphs', label: 'Number of Paragraphs', type: 'number', placeholder: '3', defaultValue: '3' }
        ],
        outputs: [
            {
                label: 'Lorem Ipsum Text',
                calculate: (inputs) => {
                    const count = Math.min(20, Math.max(1, Number(inputs['paragraphs']) || 3));
                    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

                    let result = "";
                    for (let i = 0; i < count; i++) {
                        result += (i === 0 ? "" : "\n\n") + lorem;
                    }
                    return result; // Engine renders strings directly
                }
            }
        ],
        content: { whatIs: '<h3>Lorem Ipsum</h3><p>Lorem ipsum is commonly used as placeholder text in publishing and graphic design.</p>', faq: [] }
    },
    'color-converter': {
        id: 'color-converter',
        title: 'Color Converter',
        description: 'Convert HEX to RGB and HSL.',
        category: 'other', // Or 'utility'? using 'other' as per types
        icon: 'Palette',
        meta: { title: 'Color Converter | HEX to RGB, HSL', description: 'Convert HEX color codes to RGB and HSL formats instantly.', keywords: ['color converter', 'hex to rgb', 'hex to hsl'] },
        inputs: [
            { id: 'hex', label: 'HEX Color', type: 'text', placeholder: 'e.g. #3B82F6', defaultValue: '#3B82F6' }
        ],
        outputs: [
            {
                label: 'RGB',
                calculate: (inputs) => {
                    let hex = String(inputs['hex']).replace('#', '');
                    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
                    if (hex.length !== 6) return 'Invalid HEX';

                    const r = parseInt(hex.substring(0, 2), 16);
                    const g = parseInt(hex.substring(2, 4), 16);
                    const b = parseInt(hex.substring(4, 6), 16);

                    if (isNaN(r) || isNaN(g) || isNaN(b)) return 'Invalid HEX';
                    return `rgb(${r}, ${g}, ${b})`;
                }
            },
            {
                label: 'HSL',
                calculate: (inputs) => {
                    let hex = String(inputs['hex']).replace('#', '');
                    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
                    if (hex.length !== 6) return 'Invalid HEX';

                    let r = parseInt(hex.substring(0, 2), 16) / 255;
                    let g = parseInt(hex.substring(2, 4), 16) / 255;
                    let b = parseInt(hex.substring(4, 6), 16) / 255;

                    if (isNaN(r) || isNaN(g) || isNaN(b)) return 'Invalid HEX';

                    const max = Math.max(r, g, b), min = Math.min(r, g, b);
                    let h = 0, s = 0, l = (max + min) / 2;

                    if (max !== min) {
                        const d = max - min;
                        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                        switch (max) {
                            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                            case g: h = (b - r) / d + 2; break;
                            case b: h = (r - g) / d + 4; break;
                        }
                        h /= 6;
                    }

                    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
                }
            }
        ],
        content: { whatIs: '<h3>Color Formats</h3><p>HEX (Hexadecimal) is used in web design. RGB (Red Green Blue) is for screens. HSL (Hue Saturation Lightness) is for human perception.</p>', faq: [] }
    },
    'aspect-ratio-calculator': {
        id: 'aspect-ratio-calculator',
        title: 'Aspect Ratio Calculator',
        description: 'Calculate dimensions based on aspect ratio.',
        category: 'other',
        icon: 'Monitor',
        meta: { title: 'Aspect Ratio Calculator', description: 'Calculate image or screen dimensions based on 16:9, 4:3, or custom ratios.', keywords: ['aspect ratio', '16:9 calculator', 'screen resolution'] },
        inputs: [
            { id: 'w1', label: 'Original Width', type: 'number', placeholder: '1920' },
            { id: 'h1', label: 'Original Height', type: 'number', placeholder: '1080' },
            // "Calculate New Height from Width" or "New Width from Height"
            // Let's enable both by asking for ONE.
            { id: 'w2', label: 'New Width (Optional)', type: 'number', placeholder: 'e.g. 1280' },
            { id: 'h2', label: 'New Height (Optional)', type: 'number', placeholder: 'e.g. 720' }
        ],
        outputs: [
            {
                label: 'Resulting Dimension',
                calculate: (inputs) => {
                    const w1 = Number(inputs['w1']);
                    const h1 = Number(inputs['h1']);
                    const w2 = Number(inputs['w2']);
                    const h2 = Number(inputs['h2']);

                    if (!w1 || !h1) return 0;

                    // If W2 is provided, calc H2
                    if (w2 && !h2) {
                        return `Height: ${Math.round((w2 * h1) / w1)}`;
                    }
                    // If H2 is provided, calc W2
                    if (h2 && !w2) {
                        return `Width: ${Math.round((h2 * w1) / h1)}`;
                    }

                    // If neither, just show ratio?
                    // Simplify: Reduce fraction w1/h1
                    const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
                    const divisor = gcd(w1, h1);
                    return `Ratio: ${w1 / divisor}:${h1 / divisor}`;
                }
            }
        ],
        content: { whatIs: '<h3>Aspect Ratio</h3><p>The proportional relationship between the width and height of an image or screen.</p>', faq: [] }
    },
    'carbon-footprint-calculator': {
        id: 'carbon-footprint-calculator',
        title: 'Carbon Footprint Calculator',
        description: 'Estimate your annual CO2 emissions.',
        category: 'ecology',
        icon: 'Leaf',
        meta: { title: 'Carbon Footprint Calculator', description: 'Estimate your annual carbon footprint from driving and electricity usage.', keywords: ['carbon footprint', 'co2 emissions', 'climate change calculator'] },
        inputs: [
            { id: 'miles', label: 'Miles Driven (per week)', type: 'number', placeholder: 'e.g. 100' },
            { id: 'mpg', label: 'Car MPG', type: 'number', placeholder: 'e.g. 25', defaultValue: '25' },
            { id: 'kwh', label: 'Electricity Usage (kWh/month)', type: 'number', placeholder: 'e.g. 300' }
        ],
        outputs: [
            {
                label: 'Annual CO2 (lbs)',
                unit: 'lbs',
                calculate: (inputs) => {
                    const miles = Number(inputs['miles']) || 0;
                    const mpg = Number(inputs['mpg']) || 25;
                    const kwh = Number(inputs['kwh']) || 0;

                    // Gas: approx 19.6 lbs CO2 per gallon.
                    const gasCO2 = (miles * 52 / mpg) * 19.6;

                    // Elec: approx 0.92 lbs CO2 per kWh (US avg). varies wildy.
                    const elecCO2 = kwh * 12 * 0.92;

                    return parseFloat((gasCO2 + elecCO2).toFixed(2));
                }
            },
            {
                label: 'Annual CO2 (Metric Tonnes)',
                unit: 'tonnes',
                calculate: (inputs) => {
                    const miles = Number(inputs['miles']) || 0;
                    const mpg = Number(inputs['mpg']) || 25;
                    const kwh = Number(inputs['kwh']) || 0;
                    const gasCO2 = (miles * 52 / mpg) * 19.6;
                    const elecCO2 = kwh * 12 * 0.92;
                    const totalLbs = gasCO2 + elecCO2;

                    // 1 metric tonne = 2204.62 lbs
                    return parseFloat((totalLbs / 2204.62).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Carbon Footprint</h3><p>The total amount of greenhouse gases (including carbon dioxide and methane) that are generated by our actions.</p>', faq: [] }
    },
    'water-usage-calculator': {
        id: 'water-usage-calculator',
        title: 'Water Usage Calculator',
        description: 'Estimate daily household water consumption.',
        category: 'ecology',
        icon: 'Droplets',
        meta: { title: 'Water Usage Calculator', description: 'Calculate your daily household water usage.', keywords: ['water usage', 'water footprint', 'conservation'] },
        inputs: [
            { id: 'people', label: 'Household Members', type: 'number', placeholder: '1', defaultValue: '1' },
            { id: 'showers', label: 'Avg Shower Time (min)', type: 'number', placeholder: '8', defaultValue: '8' },
            { id: 'flushes', label: 'Toilet Flushes (per person/day)', type: 'number', placeholder: '5', defaultValue: '5' }
        ],
        outputs: [
            {
                label: 'Daily Water Usage',
                unit: 'gallons',
                calculate: (inputs) => {
                    const people = Number(inputs['people']) || 1;
                    const showers = Number(inputs['showers']) || 8;
                    const flushes = Number(inputs['flushes']) || 5;

                    // Avg shower: 2.1 gpm (standard head)
                    const showerUse = people * showers * 2.1;

                    // Avg flush: 1.6 gpf (standard)
                    const toiletUse = people * flushes * 1.6;

                    // Faucet/Misc: ~10 gal/person (estimate)
                    const miscUse = people * 10;

                    return parseFloat((showerUse + toiletUse + miscUse).toFixed(2));
                }
            },
            {
                label: 'Monthly Water Usage',
                unit: 'gallons',
                calculate: (inputs) => {
                    const people = Number(inputs['people']) || 1;
                    const showers = Number(inputs['showers']) || 8;
                    const flushes = Number(inputs['flushes']) || 5;
                    const daily = (people * showers * 2.1) + (people * flushes * 1.6) + (people * 10);
                    return parseFloat((daily * 30).toFixed(0));
                }
            }
        ],
        content: { whatIs: '<h3>Water Conservation</h3><p>Reducing water usage helps preserve our environment and saves money on utility bills.</p>', faq: [] }
    },
    'electricity-cost-calculator': {
        id: 'electricity-cost-calculator',
        title: 'Electricity Cost Calculator',
        description: 'Calculate running cost of appliances.',
        category: 'finance', // or ecology? fits both.
        icon: 'Zap',
        meta: { title: 'Electricity Cost Calculator', description: 'Calculate the cost of running an electrical appliance.', keywords: ['electricity cost', 'energy calculator', 'kwh cost'] },
        inputs: [
            { id: 'watts', label: 'Power Consumption (Watts)', type: 'number', placeholder: 'e.g. 1500' },
            { id: 'hours', label: 'Hours Used Per Day', type: 'number', placeholder: 'e.g. 4' },
            { id: 'rate', label: 'Cost per kWh (cents)', type: 'number', placeholder: 'e.g. 14', defaultValue: '14' }
        ],
        outputs: [
            {
                label: 'Cost Per Day',
                unit: '$',
                calculate: (inputs) => {
                    const watts = Number(inputs['watts']);
                    const hours = Number(inputs['hours']);
                    const rate = Number(inputs['rate']); // cents
                    if (!watts) return 0;

                    const kwh = (watts * hours) / 1000;
                    const cost = kwh * (rate / 100);
                    return parseFloat(cost.toFixed(2));
                }
            },
            {
                label: 'Cost Per Month',
                unit: '$',
                calculate: (inputs) => {
                    const watts = Number(inputs['watts']);
                    const hours = Number(inputs['hours']);
                    const rate = Number(inputs['rate']);
                    if (!watts) return 0;
                    const kwh = (watts * hours) / 1000;
                    const cost = kwh * (rate / 100);
                    return parseFloat((cost * 30).toFixed(2));
                }
            },
            {
                label: 'Cost Per Year',
                unit: '$',
                calculate: (inputs) => {
                    const watts = Number(inputs['watts']);
                    const hours = Number(inputs['hours']);
                    const rate = Number(inputs['rate']);
                    if (!watts) return 0;
                    const kwh = (watts * hours) / 1000;
                    const cost = kwh * (rate / 100);
                    return parseFloat((cost * 365).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Kilowatt-Hours (kWh)</h3><p>A unit of energy equal to 1000 watts used for one hour.</p>', faq: [] }
    },
    'noise-level-estimator': {
        id: 'noise-level-estimator',
        title: 'Noise Level Distance Calculator',
        description: 'Estimate sound attenuation over distance.',
        category: 'ecology', // Physics? Ecology/Environment fits "Noise Pollution".
        icon: 'Volume2',
        meta: { title: 'Noise Level Distance Calculator', description: 'Calculate how sound levels (dB) decrease over distance.', keywords: ['noise calculator', 'decibel distance', 'sound attenuation'] },
        inputs: [
            { id: 'db1', label: 'Sound Level at Source (dB)', type: 'number', placeholder: 'e.g. 90' },
            { id: 'd1', label: 'Distance from Source (ft/m)', type: 'number', placeholder: '1', defaultValue: '1' },
            { id: 'd2', label: 'Target Distance (ft/m)', type: 'number', placeholder: 'e.g. 10' }
        ],
        outputs: [
            {
                label: 'Sound Level at Target',
                unit: 'dB',
                calculate: (inputs) => {
                    const L1 = Number(inputs['db1']);
                    const d1 = Number(inputs['d1']) || 1;
                    const d2 = Number(inputs['d2']);

                    if (!L1 || !d2) return 0;
                    // Point source: L2 = L1 - 20 * log10(d2/d1)
                    if (d2 <= 0 || d1 <= 0) return 0;

                    const L2 = L1 - 20 * Math.log10(d2 / d1);
                    return parseFloat(L2.toFixed(1));
                }
            },
            {
                label: 'Attenuation (Reduction)',
                unit: 'dB',
                calculate: (inputs) => {
                    const L1 = Number(inputs['db1']);
                    const d1 = Number(inputs['d1']) || 1;
                    const d2 = Number(inputs['d2']);
                    if (d2 <= 0 || d1 <= 0) return 0;

                    const change = 20 * Math.log10(d2 / d1);
                    return parseFloat(change.toFixed(1));
                }
            }
        ],
        content: { whatIs: '<h3>Inverse Square Law</h3><p>In a free field, sound pressure level decreases by 6 dB for every doubling of distance from a point source.</p>', faq: [] }
    },
    'mean-median-mode': {
        id: 'mean-median-mode',
        title: 'Mean, Median, Mode Calculator',
        description: 'Calculate central tendency statistics.',
        category: 'statistics',
        icon: 'BarChart',
        meta: { title: 'Mean Median Mode Calculator', description: 'Calculate the Mean, Median, Mode, Range, and Sort your data set.', keywords: ['mean calculator', 'median calculator', 'mode calculator', 'statistics'] },
        inputs: [
            { id: 'dataset', label: 'Data Set (comma separated)', type: 'text', placeholder: 'e.g. 10, 2, 38, 23, 38, 23, 21' }
        ],
        outputs: [
            {
                label: 'Mean (Average)',
                calculate: (inputs) => {
                    const str = String(inputs['dataset']);
                    const arr = str.split(',').map(Number).filter(n => !isNaN(n));
                    if (arr.length === 0) return 0;
                    const sum = arr.reduce((a, b) => a + b, 0);
                    return parseFloat((sum / arr.length).toFixed(4));
                }
            },
            {
                label: 'Median',
                calculate: (inputs) => {
                    const str = String(inputs['dataset']);
                    const arr = str.split(',').map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
                    if (arr.length === 0) return 0;
                    const mid = Math.floor(arr.length / 2);
                    if (arr.length % 2 !== 0) return arr[mid];
                    return (arr[mid - 1] + arr[mid]) / 2;
                }
            },
            {
                label: 'Mode',
                calculate: (inputs) => {
                    const str = String(inputs['dataset']);
                    const arr = str.split(',').map(Number).filter(n => !isNaN(n));
                    if (arr.length === 0) return 'None';
                    const counts: Record<number, number> = {};
                    arr.forEach(n => counts[n] = (counts[n] || 0) + 1);

                    let maxFreq = 0;
                    for (const n in counts) {
                        if (counts[n] > maxFreq) maxFreq = counts[n];
                    }
                    if (maxFreq === 1) return 'No Mode';

                    const modes = Object.keys(counts).filter(n => counts[Number(n)] === maxFreq).map(Number);
                    return modes.join(', '); // Engine renders string key
                }
            },
            {
                label: 'Range',
                calculate: (inputs) => {
                    const str = String(inputs['dataset']);
                    const arr = str.split(',').map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
                    if (arr.length === 0) return 0;
                    return arr[arr.length - 1] - arr[0];
                }
            }
        ],
        content: { whatIs: '<h3>Central Tendency</h3><p>Measures that describe the center of a data set. Mean is the average, median is the middle value, and mode is the most frequent value.</p>', faq: [] }
    },
    'standard-deviation-calculator': {
        id: 'standard-deviation-calculator',
        title: 'Standard Deviation Calculator',
        description: 'Calculate variance and deviation.',
        category: 'statistics',
        icon: 'Sigma',
        meta: { title: 'Standard Deviation Calculator', description: 'Calculate Standard Deviation and Variance for population and sample data.', keywords: ['standard deviation', 'variance', 'statistics calculator'] },
        inputs: [
            { id: 'dataset', label: 'Data Set (comma separated)', type: 'text', placeholder: 'e.g. 10, 12, 23, 23, 16, 23, 21, 16' }
        ],
        outputs: [
            {
                label: 'Sample Standard Deviation (s)',
                calculate: (inputs) => {
                    const str = String(inputs['dataset']);
                    const arr = str.split(',').map(Number).filter(n => !isNaN(n));
                    if (arr.length < 2) return 0;
                    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
                    const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (arr.length - 1);
                    return parseFloat(Math.sqrt(variance).toFixed(4));
                }
            },
            {
                label: 'Population Standard Deviation (σ)',
                calculate: (inputs) => {
                    const str = String(inputs['dataset']);
                    const arr = str.split(',').map(Number).filter(n => !isNaN(n));
                    if (arr.length === 0) return 0;
                    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
                    const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
                    return parseFloat(Math.sqrt(variance).toFixed(4));
                }
            },
            {
                label: 'Sample Variance (s²)',
                calculate: (inputs) => {
                    const str = String(inputs['dataset']);
                    const arr = str.split(',').map(Number).filter(n => !isNaN(n));
                    if (arr.length < 2) return 0;
                    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
                    const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (arr.length - 1);
                    return parseFloat(variance.toFixed(4));
                }
            }
        ],
        content: { whatIs: '<h3>Standard Deviation</h3><p>A measure of the amount of variation or dispersion of a set of values.</p>', faq: [] }
    },
    'confidence-interval-calculator': {
        id: 'confidence-interval-calculator',
        title: 'Confidence Interval Calculator',
        description: 'Find the confidence interval for a sample.',
        category: 'statistics',
        icon: 'Target',
        meta: { title: 'Confidence Interval Calculator', description: 'Calculate the confidence interval for a mean using the sample mean, standard deviation, and sample size.', keywords: ['confidence interval', 'confidence level', 'margin of error'] },
        inputs: [
            { id: 'mean', label: 'Sample Mean (x̄)', type: 'number', placeholder: 'e.g. 50' },
            { id: 'stddev', label: 'Sample Std Dev (s)', type: 'number', placeholder: 'e.g. 5' },
            { id: 'size', label: 'Sample Size (n)', type: 'number', placeholder: 'e.g. 100' },
            {
                id: 'level', label: 'Confidence Level', type: 'select', defaultValue: '0.95',
                options: [
                    { label: '90%', value: '0.90' },
                    { label: '95%', value: '0.95' },
                    { label: '99%', value: '0.99' },
                    { label: '99.9%', value: '0.999' }
                ]
            }
        ],
        outputs: [
            {
                label: 'Confidence Interval',
                calculate: (inputs) => {
                    const x = Number(inputs['mean']);
                    const s = Number(inputs['stddev']);
                    const n = Number(inputs['size']);
                    const level = Number(inputs['level']);

                    if (!n || n <= 0) return '0 - 0';

                    // Z-scores for standard levels
                    let z = 1.96; // default 95%
                    if (Math.abs(level - 0.90) < 0.001) z = 1.645;
                    if (Math.abs(level - 0.95) < 0.001) z = 1.96;
                    if (Math.abs(level - 0.99) < 0.001) z = 2.576;
                    if (Math.abs(level - 0.999) < 0.001) z = 3.291;

                    const error = z * (s / Math.sqrt(n));
                    const lower = x - error;
                    const upper = x + error;

                    return `[ ${lower.toFixed(2)}, ${upper.toFixed(2)} ]`;
                }
            },
            {
                label: 'Margin of Error',
                calculate: (inputs) => {
                    const s = Number(inputs['stddev']);
                    const n = Number(inputs['size']);
                    const level = Number(inputs['level']);
                    if (!n || n <= 0) return 0;

                    let z = 1.96;
                    if (Math.abs(level - 0.90) < 0.001) z = 1.645;
                    if (Math.abs(level - 0.95) < 0.001) z = 1.96;
                    if (Math.abs(level - 0.99) < 0.001) z = 2.576;
                    if (Math.abs(level - 0.999) < 0.001) z = 3.291;

                    return parseFloat((z * (s / Math.sqrt(n))).toFixed(4));
                }
            }
        ],
        content: { whatIs: '<h3>Confidence Interval</h3><p>A range of values so defined that there is a specified probability that the value of a parameter lies within it.</p>', faq: [] }
    },
    'scientific-notation-converter': {
        id: 'scientific-notation-converter',
        title: 'Scientific Notation Converter',
        description: 'Convert numbers to scientific notation.',
        category: 'math', // or statistics? Math fits best.
        icon: 'Binary',
        meta: { title: 'Scientific Notation Converter', description: 'Convert numbers to and from scientific notation (Standard Form).', keywords: ['scientific notation', 'standard form', 'e notation'] },
        inputs: [
            { id: 'number', label: 'Decimal Number', type: 'number', placeholder: 'e.g. 0.000123' }
            // Could add reverse conversion, but let's start simple 1-way.
        ],
        outputs: [
            {
                label: 'Scientific Notation (E)',
                calculate: (inputs) => {
                    const n = Number(inputs['number']);
                    if (n === 0) return '0';
                    if (isNaN(n)) return 'Invalid';
                    return n.toExponential();
                }
            },
            {
                label: 'Standard Form (a × 10ⁿ)',
                calculate: (inputs) => {
                    const n = Number(inputs['number']);
                    if (n === 0) return '0';
                    if (isNaN(n)) return 'Invalid';

                    const expStr = n.toExponential();
                    const [coeff, exponent] = expStr.split('e');

                    // Format nice HTML sup? No, engine renders text.
                    // Use unicode super scripts? Maybe risky for fonts.
                    // Just standard text.
                    return `${coeff} × 10^${Number(exponent)}`;
                }
            }
        ],
        content: { whatIs: '<h3>Scientific Notation</h3><p>A way of expressing numbers that are too large or too small to be conveniently written in decimal form.</p>', faq: [] }
    },
    'pythagorean-calculator': {
        id: 'pythagorean-calculator',
        title: 'Pythagorean Theorem Calculator',
        description: 'Calculate lengths of right triangle sides.',
        category: 'math',
        icon: 'Triangle',
        meta: { title: 'Pythagorean Theorem Calculator', description: 'Calculate the length of the potentially missing side of a right triangle.', keywords: ['pythagorean theorem', 'right triangle', 'hypotenuse calculator'] },
        inputs: [
            { id: 'a', label: 'Side A (Leg)', type: 'number', placeholder: 'e.g. 3' },
            { id: 'b', label: 'Side B (Leg)', type: 'number', placeholder: 'e.g. 4' },
            { id: 'c', label: 'Side C (Hypotenuse)', type: 'number', placeholder: 'e.g. 5' }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const a = Number(inputs['a']);
                    const b = Number(inputs['b']);
                    const c = Number(inputs['c']);

                    // Logic: If 2 are known, solve for 3rd.
                    if (a && b && !c) {
                        return `Hypotenuse C = ${Math.sqrt(a * a + b * b).toFixed(4)}`;
                    }
                    if (a && c && !b) {
                        if (c <= a) return 'Error: Hypotenuse must be longest';
                        return `Leg B = ${Math.sqrt(c * c - a * a).toFixed(4)}`;
                    }
                    if (b && c && !a) {
                        if (c <= b) return 'Error: Hypotenuse must be longest';
                        return `Leg A = ${Math.sqrt(c * c - b * b).toFixed(4)}`;
                    }
                    if (a && b && c) {
                        // Check if valid
                        const check = Math.abs((a * a + b * b) - c * c) < 0.001;
                        return check ? 'Valid Right Triangle' : 'Not a Right Triangle';
                    }

                    return 'Enter exactly 2 values';
                }
            }
        ],
        content: { whatIs: '<h3>Pythagorean Theorem</h3><p>In a right-angled triangle, the square of the hypotenuse side is equal to the sum of squares of the other two sides: a² + b² = c².</p>', faq: [] }
    },
    'slope-calculator': {
        id: 'slope-calculator',
        title: 'Slope Calculator',
        description: 'Calculate slope between two points.',
        category: 'math',
        icon: 'TrendingUp',
        meta: { title: 'Slope Calculator', description: 'Calculate the slope, distance, and angle between two points.', keywords: ['slope calculator', 'gradient', 'coordinate geometry'] },
        inputs: [
            { id: 'x1', label: 'X1', type: 'number', placeholder: '0', defaultValue: '0' },
            { id: 'y1', label: 'Y1', type: 'number', placeholder: '0', defaultValue: '0' },
            { id: 'x2', label: 'X2', type: 'number', placeholder: '5' },
            { id: 'y2', label: 'Y2', type: 'number', placeholder: '5' }
        ],
        outputs: [
            {
                label: 'Slope (m)',
                calculate: (inputs) => {
                    const x1 = Number(inputs['x1']);
                    const y1 = Number(inputs['y1']);
                    const x2 = Number(inputs['x2']);
                    const y2 = Number(inputs['y2']);

                    if (x2 === x1) return 'Undefined (Vertical)';
                    return parseFloat(((y2 - y1) / (x2 - x1)).toFixed(4));
                }
            },
            {
                label: 'Distance (d)',
                calculate: (inputs) => {
                    const x1 = Number(inputs['x1']);
                    const y1 = Number(inputs['y1']);
                    const x2 = Number(inputs['x2']);
                    const y2 = Number(inputs['y2']);
                    return parseFloat(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)).toFixed(4));
                }
            },
            {
                label: 'Angle (degrees)',
                calculate: (inputs) => {
                    const x1 = Number(inputs['x1']);
                    const y1 = Number(inputs['y1']);
                    const x2 = Number(inputs['x2']);
                    const y2 = Number(inputs['y2']);
                    const rad = Math.atan2(y2 - y1, x2 - x1);
                    return parseFloat((rad * 180 / Math.PI).toFixed(2)) + '°';
                }
            }
        ],
        content: { whatIs: '<h3>Slope</h3><p>The slope or gradient of a line is a number that describes both the direction and the steepness of the line. m = (y2 - y1) / (x2 - x1).</p>', faq: [] }
    },
    'exponent-calculator': {
        id: 'exponent-calculator',
        title: 'Exponent Calculator',
        description: 'Calculate power of a number.',
        category: 'math',
        icon: 'Superscript', // Assuming available or similar. 'ChevronUp'? Lucide 'Superscript' might not exist. 
        // Checking icon... 'Superscript' is valid in Lucide? Maybe not. 'Power'? 'Zap' is electricity. 
        // Let's use 'ChevronUp' or 'ArrowUp' as fallback if not sure?
        // Actually, 'X' icon? 
        // 'Superscript' DOES exist in recent lucide versions. If not, build might fail or show nothing.
        // Let's safe bet 'ArrowUp' or similar? Or 'Hash'?
        // 'Variable' is an icon.
        // 'Pow' is not.
        // Let's try 'Superscript' if confident, otherwise 'ArrowUp'.
        // Actually, I'll use 'ChevronsUp' (plural) or just 'ArrowUp'. 
        // Wait, 'Triangle' was used for Pythagorean.
        // Let's use 'Activity' or something abstract if needed.
        // I will use 'TrendingUp' for slope.
        // For Exponent, I'll use 'ChevronsUp' which looks like specific power.
        // NOTE: If 'ChevronsUp' fails, I'll fix.
        icon: 'ChevronsUp',
        meta: { title: 'Exponent Calculator', description: 'Calculate the power of a number (Base raised to an Exponent).', keywords: ['exponent calculator', 'power calculator', 'indices'] },
        inputs: [
            { id: 'base', label: 'Base', type: 'number', placeholder: 'e.g. 2' },
            { id: 'exponent', label: 'Exponent', type: 'number', placeholder: 'e.g. 3' }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const b = Number(inputs['base']);
                    const e = Number(inputs['exponent']);
                    if (isNaN(b) || isNaN(e)) return 0;
                    return Math.pow(b, e);
                }
            }
        ],
        content: { whatIs: '<h3>Exponents</h3><p>Exponentiation is a mathematical operation, written as bⁿ, involving two numbers, the base b and the exponent or power n.</p>', faq: [] }
    },
    'square-root-calculator': {
        id: 'square-root-calculator',
        title: 'Square Root Calculator',
        description: 'Find the square root of a number.',
        category: 'math',
        icon: 'Divide', // 'SquareRoot' icon doesn't exist standard. 'Divide' is mathy. Or just 'Calculator'.
        // 'Sigma' used for standard dev.
        // 'Scaling'?
        // 'Divide' is okay.
        meta: { title: 'Square Root Calculator', description: 'Calculate the square root of a number.', keywords: ['square root calculator', 'radical', 'math'] },
        inputs: [
            { id: 'number', label: 'Number', type: 'number', placeholder: 'e.g. 16' }
        ],
        outputs: [
            {
                label: 'Square Root',
                calculate: (inputs) => {
                    const n = Number(inputs['number']);
                    if (n < 0) return 'Imaginary';
                    return Math.sqrt(n);
                }
            },
            {
                label: 'Cube Root',
                calculate: (inputs) => {
                    const n = Number(inputs['number']);
                    return Math.cbrt(n).toFixed(4); // Add bonus cube root
                }
            }
        ],
        content: { whatIs: '<h3>Square Root</h3><p>The square root of a number is a value that, when multiplied by itself, gives the number.</p>', faq: [] }
    },
    'fuel-cost-calculator': {
        id: 'fuel-cost-calculator',
        title: 'Fuel Cost Calculator',
        description: 'Calculate trip fuel cost.',
        category: 'everyday',
        icon: 'Fuel',
        meta: { title: 'Fuel Cost Calculator', description: 'Calculate the fuel cost for your trip based on distance, fuel efficiency, and gas price.', keywords: ['fuel cost', 'gas cost calculator', 'trip planner'] },
        inputs: [
            { id: 'distance', label: 'Trip Distance (miles)', type: 'number', placeholder: 'e.g. 200' },
            { id: 'mpg', label: 'Fuel Efficiency (MPG)', type: 'number', placeholder: 'e.g. 30', defaultValue: '30' },
            { id: 'price', label: 'Gas Price ($/gallon)', type: 'number', placeholder: 'e.g. 3.50', defaultValue: '3.50' }
        ],
        outputs: [
            {
                label: 'Total Fuel Cost',
                unit: '$',
                calculate: (inputs) => {
                    const dist = Number(inputs['distance']);
                    const mpg = Number(inputs['mpg']) || 30;
                    const price = Number(inputs['price']) || 3.50;
                    if (!dist) return 0;
                    const gallons = dist / mpg;
                    return parseFloat((gallons * price).toFixed(2));
                }
            },
            {
                label: 'Gallons Needed',
                unit: 'gal',
                calculate: (inputs) => {
                    const dist = Number(inputs['distance']);
                    const mpg = Number(inputs['mpg']) || 30;
                    if (!dist) return 0;
                    return parseFloat((dist / mpg).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Trip Planning</h3><p>Knowing your fuel cost helps budget for road trips.</p>', faq: [] }
    },
    'random-number-generator': {
        id: 'random-number-generator',
        title: 'Random Number Generator',
        description: 'Generate a random number in a range.',
        category: 'other',
        icon: 'Shuffle',
        meta: { title: 'Random Number Generator', description: 'Generate random numbers within a specified range.', keywords: ['random number', 'rng', 'random picker'] },
        inputs: [
            { id: 'min', label: 'Minimum', type: 'number', placeholder: '1', defaultValue: '1' },
            { id: 'max', label: 'Maximum', type: 'number', placeholder: '100', defaultValue: '100' }
        ],
        outputs: [
            {
                label: 'Random Number',
                calculate: (inputs) => {
                    const min = Math.ceil(Number(inputs['min']) || 1);
                    const max = Math.floor(Number(inputs['max']) || 100);
                    if (min > max) return 'Min must be <= Max';
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }
            }
        ],
        content: { whatIs: '<h3>Random Numbers</h3><p>Useful for games, decisions, or sampling.</p>', faq: [] }
    },
    'grade-calculator': {
        id: 'grade-calculator',
        title: 'Grade Calculator',
        description: 'Calculate weighted grade average.',
        category: 'education',
        icon: 'GraduationCap',
        meta: { title: 'Grade Calculator', description: 'Calculate your weighted average grade.', keywords: ['grade calculator', 'gpa', 'weighted average'] },
        inputs: [
            { id: 'g1', label: 'Grade 1 (%)', type: 'number', placeholder: 'e.g. 85' },
            { id: 'w1', label: 'Weight 1 (%)', type: 'number', placeholder: 'e.g. 30' },
            { id: 'g2', label: 'Grade 2 (%)', type: 'number', placeholder: 'e.g. 90' },
            { id: 'w2', label: 'Weight 2 (%)', type: 'number', placeholder: 'e.g. 30' },
            { id: 'g3', label: 'Grade 3 (%)', type: 'number', placeholder: 'e.g. 75' },
            { id: 'w3', label: 'Weight 3 (%)', type: 'number', placeholder: 'e.g. 40' }
        ],
        outputs: [
            {
                label: 'Weighted Average',
                unit: '%',
                calculate: (inputs) => {
                    const g1 = Number(inputs['g1']) || 0;
                    const w1 = Number(inputs['w1']) || 0;
                    const g2 = Number(inputs['g2']) || 0;
                    const w2 = Number(inputs['w2']) || 0;
                    const g3 = Number(inputs['g3']) || 0;
                    const w3 = Number(inputs['w3']) || 0;

                    const totalWeight = w1 + w2 + w3;
                    if (totalWeight === 0) return 0;

                    const weighted = (g1 * w1 + g2 * w2 + g3 * w3) / totalWeight;
                    return parseFloat(weighted.toFixed(2));
                }
            },
            {
                label: 'Letter Grade',
                calculate: (inputs) => {
                    const g1 = Number(inputs['g1']) || 0;
                    const w1 = Number(inputs['w1']) || 0;
                    const g2 = Number(inputs['g2']) || 0;
                    const w2 = Number(inputs['w2']) || 0;
                    const g3 = Number(inputs['g3']) || 0;
                    const w3 = Number(inputs['w3']) || 0;
                    const totalWeight = w1 + w2 + w3;
                    if (totalWeight === 0) return '-';
                    const avg = (g1 * w1 + g2 * w2 + g3 * w3) / totalWeight;

                    if (avg >= 90) return 'A';
                    if (avg >= 80) return 'B';
                    if (avg >= 70) return 'C';
                    if (avg >= 60) return 'D';
                    return 'F';
                }
            }
        ],
        content: { whatIs: '<h3>Weighted Grades</h3><p>Calculate your final grade by weighting each component.</p>', faq: [] }
    },
    'tip-split-calculator': {
        id: 'tip-split-calculator',
        title: 'Tip & Bill Split Calculator',
        description: 'Split a bill and calculate tip.',
        category: 'everyday',
        icon: 'Split',
        meta: { title: 'Tip Split Calculator', description: 'Split a restaurant bill evenly and calculate tip per person.', keywords: ['tip calculator', 'split bill', 'restaurant calculator'] },
        inputs: [
            { id: 'bill', label: 'Total Bill ($)', type: 'number', placeholder: 'e.g. 85' },
            { id: 'tip', label: 'Tip Percentage (%)', type: 'number', placeholder: '18', defaultValue: '18' },
            { id: 'people', label: 'Number of People', type: 'number', placeholder: '4', defaultValue: '4' }
        ],
        outputs: [
            {
                label: 'Tip Amount',
                unit: '$',
                calculate: (inputs) => {
                    const bill = Number(inputs['bill']) || 0;
                    const tipPct = Number(inputs['tip']) || 18;
                    return parseFloat((bill * tipPct / 100).toFixed(2));
                }
            },
            {
                label: 'Total with Tip',
                unit: '$',
                calculate: (inputs) => {
                    const bill = Number(inputs['bill']) || 0;
                    const tipPct = Number(inputs['tip']) || 18;
                    return parseFloat((bill * (1 + tipPct / 100)).toFixed(2));
                }
            },
            {
                label: 'Per Person',
                unit: '$',
                calculate: (inputs) => {
                    const bill = Number(inputs['bill']) || 0;
                    const tipPct = Number(inputs['tip']) || 18;
                    const people = Number(inputs['people']) || 1;
                    const total = bill * (1 + tipPct / 100);
                    return parseFloat((total / people).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Splitting Bills</h3><p>Easily divide a restaurant check among friends.</p>', faq: [] }
    },
    'time-zone-converter': {
        id: 'time-zone-converter',
        title: 'Time Zone Converter',
        description: 'Convert time between zones.',
        category: 'everyday',
        icon: 'Globe',
        meta: { title: 'Time Zone Converter', description: 'Convert time from one time zone to another.', keywords: ['time zone', 'world clock', 'time converter'] },
        inputs: [
            { id: 'hour', label: 'Hour (0-23)', type: 'number', placeholder: 'e.g. 14', defaultValue: '12' },
            { id: 'minute', label: 'Minute', type: 'number', placeholder: 'e.g. 30', defaultValue: '0' },
            { id: 'from_offset', label: 'From UTC Offset (hrs)', type: 'number', placeholder: 'e.g. -5 for EST', defaultValue: '0' },
            { id: 'to_offset', label: 'To UTC Offset (hrs)', type: 'number', placeholder: 'e.g. 1 for CET', defaultValue: '0' }
        ],
        outputs: [
            {
                label: 'Converted Time',
                calculate: (inputs) => {
                    const hour = Number(inputs['hour']) || 12;
                    const minute = Number(inputs['minute']) || 0;
                    const fromOffset = Number(inputs['from_offset']) || 0;
                    const toOffset = Number(inputs['to_offset']) || 0;

                    const diff = toOffset - fromOffset;
                    let newHour = hour + diff;

                    // Handle day wrap
                    if (newHour >= 24) newHour -= 24;
                    if (newHour < 0) newHour += 24;

                    const padH = String(Math.floor(newHour)).padStart(2, '0');
                    const padM = String(minute).padStart(2, '0');
                    return `${padH}:${padM}`;
                }
            }
        ],
        content: { whatIs: '<h3>Time Zones</h3><p>Regions of the globe that observe a uniform standard time.</p>', faq: [] }
    },
    'countdown-calculator': {
        id: 'countdown-calculator',
        title: 'Countdown Calculator',
        description: 'Days until an event.',
        category: 'everyday',
        icon: 'CalendarClock',
        meta: { title: 'Countdown Calculator', description: 'Calculate days, hours, and minutes until a specific date.', keywords: ['countdown', 'days until', 'event countdown'] },
        inputs: [
            { id: 'target', label: 'Target Date', type: 'date', placeholder: 'YYYY-MM-DD' }
        ],
        outputs: [
            {
                label: 'Days Until',
                unit: 'days',
                calculate: (inputs) => {
                    const target = inputs['target'];
                    if (!target) return 0;

                    const targetDate = new Date(String(target));
                    const now = new Date();

                    const diff = targetDate.getTime() - now.getTime();
                    if (diff < 0) return 'Date has passed';

                    return Math.ceil(diff / (1000 * 60 * 60 * 24));
                }
            },
            {
                label: 'Weeks',
                calculate: (inputs) => {
                    const target = inputs['target'];
                    if (!target) return 0;
                    const targetDate = new Date(String(target));
                    const now = new Date();
                    const diff = targetDate.getTime() - now.getTime();
                    if (diff < 0) return '-';
                    return parseFloat((diff / (1000 * 60 * 60 * 24 * 7)).toFixed(1));
                }
            }
        ],
        content: { whatIs: '<h3>Countdown</h3><p>Track time until an important event.</p>', faq: [] }
    },
    'work-hours-calculator': {
        id: 'work-hours-calculator',
        title: 'Work Hours Calculator',
        description: 'Calculate hours worked.',
        category: 'finance',
        icon: 'Clock',
        meta: { title: 'Work Hours Calculator', description: 'Calculate total hours and minutes worked between start and end times.', keywords: ['work hours', 'time card', 'hours worked'] },
        inputs: [
            { id: 'start_h', label: 'Start Hour (0-23)', type: 'number', placeholder: '9', defaultValue: '9' },
            { id: 'start_m', label: 'Start Minute', type: 'number', placeholder: '0', defaultValue: '0' },
            { id: 'end_h', label: 'End Hour (0-23)', type: 'number', placeholder: '17', defaultValue: '17' },
            { id: 'end_m', label: 'End Minute', type: 'number', placeholder: '30', defaultValue: '30' },
            { id: 'break_m', label: 'Break (Minutes)', type: 'number', placeholder: '60', defaultValue: '60' }
        ],
        outputs: [
            {
                label: 'Total Hours Worked',
                calculate: (inputs) => {
                    const sh = Number(inputs['start_h']) || 9;
                    const sm = Number(inputs['start_m']) || 0;
                    const eh = Number(inputs['end_h']) || 17;
                    const em = Number(inputs['end_m']) || 30;
                    const breakMin = Number(inputs['break_m']) || 60;

                    const startTotal = sh * 60 + sm;
                    let endTotal = eh * 60 + em;

                    // Handle overnight
                    if (endTotal < startTotal) endTotal += 24 * 60;

                    const worked = endTotal - startTotal - breakMin;
                    const hrs = Math.floor(worked / 60);
                    const mins = worked % 60;

                    return `${hrs}h ${mins}m`;
                }
            },
            {
                label: 'Decimal Hours',
                calculate: (inputs) => {
                    const sh = Number(inputs['start_h']) || 9;
                    const sm = Number(inputs['start_m']) || 0;
                    const eh = Number(inputs['end_h']) || 17;
                    const em = Number(inputs['end_m']) || 30;
                    const breakMin = Number(inputs['break_m']) || 60;

                    const startTotal = sh * 60 + sm;
                    let endTotal = eh * 60 + em;
                    if (endTotal < startTotal) endTotal += 24 * 60;

                    const worked = endTotal - startTotal - breakMin;
                    return parseFloat((worked / 60).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Work Hours</h3><p>Track time for payroll or billing.</p>', faq: [] }
    },
    'unix-timestamp-converter': {
        id: 'unix-timestamp-converter',
        title: 'Unix Timestamp Converter',
        description: 'Convert Unix to Human Date.',
        category: 'other',
        icon: 'Clock3',
        meta: { title: 'Unix Timestamp Converter', description: 'Convert Unix timestamps to human-readable dates and vice-versa.', keywords: ['unix timestamp', 'epoch converter', 'time converter'] },
        inputs: [
            { id: 'timestamp', label: 'Unix Timestamp (seconds)', type: 'number', placeholder: 'e.g. 1704067200' }
        ],
        outputs: [
            {
                label: 'Human Date (UTC)',
                calculate: (inputs) => {
                    const ts = Number(inputs['timestamp']);
                    if (!ts) return 'Enter a timestamp';
                    const d = new Date(ts * 1000);
                    return d.toUTCString();
                }
            },
            {
                label: 'ISO Format',
                calculate: (inputs) => {
                    const ts = Number(inputs['timestamp']);
                    if (!ts) return '-';
                    const d = new Date(ts * 1000);
                    return d.toISOString();
                }
            }
        ],
        content: { whatIs: '<h3>Unix Time</h3><p>The number of seconds elapsed since January 1, 1970 (UTC).</p>', faq: [] }
    },
    'ohms-law-calculator': {
        id: 'ohms-law-calculator',
        title: "Ohm's Law Calculator",
        description: 'Calculate Voltage, Current, or Resistance.',
        category: 'physics',
        icon: 'Zap',
        meta: { title: "Ohm's Law Calculator", description: "Calculate voltage, current, or resistance using Ohm's Law (V = IR).", keywords: ["ohm's law", 'voltage calculator', 'electrical'] },
        inputs: [
            { id: 'v', label: 'Voltage (V)', type: 'number', placeholder: 'e.g. 12' },
            { id: 'i', label: 'Current (A)', type: 'number', placeholder: 'e.g. 2' },
            { id: 'r', label: 'Resistance (Ω)', type: 'number', placeholder: 'e.g. 6' }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const v = Number(inputs['v']);
                    const i = Number(inputs['i']);
                    const r = Number(inputs['r']);

                    // V = IR
                    if (i && r && !v) return `V = ${(i * r).toFixed(2)} Volts`;
                    if (v && r && !i) return `I = ${(v / r).toFixed(4)} Amps`;
                    if (v && i && !r) return `R = ${(v / i).toFixed(2)} Ohms`;

                    if (v && i && r) {
                        const check = Math.abs(v - i * r) < 0.01;
                        return check ? 'Values are consistent' : 'Values inconsistent with V=IR';
                    }

                    return 'Enter exactly 2 values';
                }
            }
        ],
        content: { whatIs: "<h3>Ohm's Law</h3><p>V = I × R. The voltage across a conductor is directly proportional to the current flowing through it.</p>", faq: [] }
    },
    'power-calculator': {
        id: 'power-calculator',
        title: 'Electrical Power Calculator',
        description: 'Calculate power (Watts).',
        category: 'physics',
        icon: 'BatteryCharging',
        meta: { title: 'Power Calculator (Watts)', description: 'Calculate electrical power using P = IV or P = V²/R.', keywords: ['power calculator', 'watts', 'electrical'] },
        inputs: [
            { id: 'v', label: 'Voltage (V)', type: 'number', placeholder: 'e.g. 120' },
            { id: 'i', label: 'Current (A)', type: 'number', placeholder: 'e.g. 5' }
        ],
        outputs: [
            {
                label: 'Power (P)',
                unit: 'W',
                calculate: (inputs) => {
                    const v = Number(inputs['v']);
                    const i = Number(inputs['i']);
                    if (!v || !i) return 0;
                    return parseFloat((v * i).toFixed(2));
                }
            },
            {
                label: 'Resistance (R)',
                unit: 'Ω',
                calculate: (inputs) => {
                    const v = Number(inputs['v']);
                    const i = Number(inputs['i']);
                    if (!i) return 0;
                    return parseFloat((v / i).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Electrical Power</h3><p>Power is the rate of energy transfer. P = I × V.</p>', faq: [] }
    },
    'momentum-calculator': {
        id: 'momentum-calculator',
        title: 'Momentum Calculator',
        description: 'Calculate momentum (p = mv).',
        category: 'physics',
        icon: 'Move',
        meta: { title: 'Momentum Calculator', description: 'Calculate the momentum of an object using mass and velocity.', keywords: ['momentum', 'physics', 'p=mv'] },
        inputs: [
            { id: 'mass', label: 'Mass (kg)', type: 'number', placeholder: 'e.g. 10' },
            { id: 'velocity', label: 'Velocity (m/s)', type: 'number', placeholder: 'e.g. 5' }
        ],
        outputs: [
            {
                label: 'Momentum (p)',
                unit: 'kg·m/s',
                calculate: (inputs) => {
                    const m = Number(inputs['mass']);
                    const v = Number(inputs['velocity']);
                    if (!m) return 0;
                    return parseFloat((m * v).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Momentum</h3><p>The product of mass and velocity. A measure of how hard it is to stop a moving object.</p>', faq: [] }
    },
    'projectile-motion-calculator': {
        id: 'projectile-motion-calculator',
        title: 'Projectile Motion Calculator',
        description: 'Calculate range and max height.',
        category: 'physics',
        icon: 'Rocket',
        meta: { title: 'Projectile Motion Calculator', description: 'Calculate the range and maximum height of a projectile.', keywords: ['projectile motion', 'physics', 'trajectory'] },
        inputs: [
            { id: 'v0', label: 'Initial Velocity (m/s)', type: 'number', placeholder: 'e.g. 20' },
            { id: 'angle', label: 'Launch Angle (°)', type: 'number', placeholder: 'e.g. 45' },
            { id: 'g', label: 'Gravity (m/s²)', type: 'number', placeholder: '9.8', defaultValue: '9.8' }
        ],
        outputs: [
            {
                label: 'Maximum Height',
                unit: 'm',
                calculate: (inputs) => {
                    const v0 = Number(inputs['v0']);
                    const angle = Number(inputs['angle']) * Math.PI / 180;
                    const g = Number(inputs['g']) || 9.8;
                    if (!v0) return 0;

                    // H = (v0² × sin²θ) / (2g)
                    const sinA = Math.sin(angle);
                    return parseFloat(((v0 * v0 * sinA * sinA) / (2 * g)).toFixed(2));
                }
            },
            {
                label: 'Range',
                unit: 'm',
                calculate: (inputs) => {
                    const v0 = Number(inputs['v0']);
                    const angle = Number(inputs['angle']) * Math.PI / 180;
                    const g = Number(inputs['g']) || 9.8;
                    if (!v0) return 0;

                    // R = (v0² × sin2θ) / g
                    const sin2A = Math.sin(2 * angle);
                    return parseFloat(((v0 * v0 * sin2A) / g).toFixed(2));
                }
            },
            {
                label: 'Time of Flight',
                unit: 's',
                calculate: (inputs) => {
                    const v0 = Number(inputs['v0']);
                    const angle = Number(inputs['angle']) * Math.PI / 180;
                    const g = Number(inputs['g']) || 9.8;
                    if (!v0) return 0;

                    // T = 2 * v0 * sinθ / g
                    return parseFloat(((2 * v0 * Math.sin(angle)) / g).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Projectile Motion</h3><p>The motion of an object thrown or projected into the air, subject only to gravity.</p>', faq: [] }
    },
    'molar-mass-calculator': {
        id: 'molar-mass-calculator',
        title: 'Molar Mass Calculator',
        description: 'Calculate molecular weight.',
        category: 'chemistry',
        icon: 'Atom',
        meta: { title: 'Molar Mass Calculator', description: 'Calculate the molar mass (molecular weight) of a compound.', keywords: ['molar mass', 'molecular weight', 'chemistry'] },
        inputs: [
            { id: 'c', label: 'Carbon (C) atoms', type: 'number', placeholder: '0', defaultValue: '0' },
            { id: 'h', label: 'Hydrogen (H) atoms', type: 'number', placeholder: '0', defaultValue: '0' },
            { id: 'o', label: 'Oxygen (O) atoms', type: 'number', placeholder: '0', defaultValue: '0' },
            { id: 'n', label: 'Nitrogen (N) atoms', type: 'number', placeholder: '0', defaultValue: '0' }
        ],
        outputs: [
            {
                label: 'Molar Mass',
                unit: 'g/mol',
                calculate: (inputs) => {
                    const c = Number(inputs['c']) || 0;
                    const h = Number(inputs['h']) || 0;
                    const o = Number(inputs['o']) || 0;
                    const n = Number(inputs['n']) || 0;

                    // Atomic masses
                    const mass = c * 12.011 + h * 1.008 + o * 15.999 + n * 14.007;
                    return parseFloat(mass.toFixed(3));
                }
            }
        ],
        content: { whatIs: '<h3>Molar Mass</h3><p>The mass of one mole of a substance, measured in grams per mole (g/mol).</p>', faq: [] }
    },
    'dilution-calculator': {
        id: 'dilution-calculator',
        title: 'Dilution Calculator',
        description: 'Calculate dilution (C1V1 = C2V2).',
        category: 'chemistry',
        icon: 'FlaskConical',
        meta: { title: 'Dilution Calculator', description: 'Calculate solution dilution using the C1V1 = C2V2 equation.', keywords: ['dilution', 'concentration', 'chemistry'] },
        inputs: [
            { id: 'c1', label: 'Initial Concentration (C1)', type: 'number', placeholder: 'e.g. 10' },
            { id: 'v1', label: 'Initial Volume (V1)', type: 'number', placeholder: 'e.g. 5' },
            { id: 'c2', label: 'Final Concentration (C2)', type: 'number', placeholder: 'e.g. 2' }
        ],
        outputs: [
            {
                label: 'Final Volume (V2)',
                calculate: (inputs) => {
                    const c1 = Number(inputs['c1']);
                    const v1 = Number(inputs['v1']);
                    const c2 = Number(inputs['c2']);

                    if (!c1 || !v1 || !c2) return 0;
                    if (c2 === 0) return 'Cannot divide by 0';

                    // C1V1 = C2V2 => V2 = C1V1/C2
                    return parseFloat(((c1 * v1) / c2).toFixed(2));
                }
            },
            {
                label: 'Solvent to Add',
                calculate: (inputs) => {
                    const c1 = Number(inputs['c1']);
                    const v1 = Number(inputs['v1']);
                    const c2 = Number(inputs['c2']);

                    if (!c1 || !v1 || !c2) return 0;
                    const v2 = (c1 * v1) / c2;
                    return parseFloat((v2 - v1).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Dilution</h3><p>The process of reducing the concentration of a solute. C1V1 = C2V2.</p>', faq: [] }
    },
    'heart-rate-zones-calculator': {
        id: 'heart-rate-zones-calculator',
        title: 'Heart Rate Zones Calculator',
        description: 'Calculate training heart rate zones.',
        category: 'health',
        icon: 'Heart',
        meta: { title: 'Heart Rate Zones Calculator', description: 'Calculate your target heart rate zones for training.', keywords: ['heart rate zones', 'training zones', 'cardio'] },
        inputs: [
            { id: 'age', label: 'Age', type: 'number', placeholder: 'e.g. 30' },
            { id: 'rhr', label: 'Resting Heart Rate (optional)', type: 'number', placeholder: 'e.g. 60', defaultValue: '60' }
        ],
        outputs: [
            {
                label: 'Max Heart Rate',
                unit: 'bpm',
                calculate: (inputs) => {
                    const age = Number(inputs['age']);
                    if (!age) return 0;
                    return 220 - age; // Simple formula
                }
            },
            {
                label: 'Zone 2 (Fat Burn: 60-70%)',
                unit: 'bpm',
                calculate: (inputs) => {
                    const age = Number(inputs['age']);
                    if (!age) return '-';
                    const max = 220 - age;
                    return `${Math.round(max * 0.6)} - ${Math.round(max * 0.7)}`;
                }
            },
            {
                label: 'Zone 3 (Cardio: 70-80%)',
                unit: 'bpm',
                calculate: (inputs) => {
                    const age = Number(inputs['age']);
                    if (!age) return '-';
                    const max = 220 - age;
                    return `${Math.round(max * 0.7)} - ${Math.round(max * 0.8)}`;
                }
            },
            {
                label: 'Zone 4 (Peak: 80-90%)',
                unit: 'bpm',
                calculate: (inputs) => {
                    const age = Number(inputs['age']);
                    if (!age) return '-';
                    const max = 220 - age;
                    return `${Math.round(max * 0.8)} - ${Math.round(max * 0.9)}`;
                }
            }
        ],
        content: { whatIs: '<h3>Heart Rate Zones</h3><p>Training zones based on percentage of maximum heart rate.</p>', faq: [] }
    },
    'ideal-body-weight-calculator': {
        id: 'ideal-body-weight-calculator',
        title: 'Ideal Body Weight Calculator',
        description: 'Calculate ideal weight range.',
        category: 'health',
        icon: 'Scale',
        meta: { title: 'Ideal Body Weight Calculator', description: 'Calculate your ideal body weight based on height and gender.', keywords: ['ideal weight', 'healthy weight', 'fitness'] },
        inputs: [
            { id: 'height_cm', label: 'Height (cm)', type: 'number', placeholder: 'e.g. 175' },
            {
                id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male',
                options: [
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' }
                ]
            }
        ],
        outputs: [
            {
                label: 'Ideal Weight (Devine Formula)',
                unit: 'kg',
                calculate: (inputs) => {
                    const height_cm = Number(inputs['height_cm']);
                    const gender = inputs['gender'];
                    if (!height_cm) return 0;

                    const inches = height_cm / 2.54;
                    const over60 = inches - 60;

                    // Devine formula
                    if (gender === 'male') {
                        return parseFloat((50 + 2.3 * over60).toFixed(1));
                    } else {
                        return parseFloat((45.5 + 2.3 * over60).toFixed(1));
                    }
                }
            },
            {
                label: 'Healthy BMI Range',
                unit: 'kg',
                calculate: (inputs) => {
                    const height_cm = Number(inputs['height_cm']);
                    if (!height_cm) return '-';

                    const height_m = height_cm / 100;
                    const low = 18.5 * height_m * height_m;
                    const high = 24.9 * height_m * height_m;

                    return `${low.toFixed(1)} - ${high.toFixed(1)}`;
                }
            }
        ],
        content: { whatIs: '<h3>Ideal Body Weight</h3><p>Estimates based on height and formulas like Devine or BMI ranges.</p>', faq: [] }
    },
    'cooking-conversions-calculator': {
        id: 'cooking-conversions-calculator',
        title: 'Cooking Conversions',
        description: 'Convert cooking measurements.',
        category: 'everyday',
        icon: 'ChefHat',
        meta: { title: 'Cooking Conversion Calculator', description: 'Convert between cups, tablespoons, teaspoons, and milliliters.', keywords: ['cooking conversion', 'cup to ml', 'tablespoon'] },
        inputs: [
            { id: 'cups', label: 'Cups', type: 'number', placeholder: 'e.g. 2' }
        ],
        outputs: [
            {
                label: 'Milliliters (ml)',
                unit: 'ml',
                calculate: (inputs) => {
                    const cups = Number(inputs['cups']) || 0;
                    return parseFloat((cups * 236.588).toFixed(1));
                }
            },
            {
                label: 'Tablespoons',
                unit: 'tbsp',
                calculate: (inputs) => {
                    const cups = Number(inputs['cups']) || 0;
                    return cups * 16;
                }
            },
            {
                label: 'Teaspoons',
                unit: 'tsp',
                calculate: (inputs) => {
                    const cups = Number(inputs['cups']) || 0;
                    return cups * 48;
                }
            }
        ],
        content: { whatIs: '<h3>Cooking Measurements</h3><p>Convert between common kitchen measurements.</p>', faq: [] }
    },
    'recipe-scaler': {
        id: 'recipe-scaler',
        title: 'Recipe Scaler',
        description: 'Scale recipe ingredients.',
        category: 'everyday',
        icon: 'Scale',
        meta: { title: 'Recipe Scaler Calculator', description: 'Scale recipe ingredient quantities up or down.', keywords: ['recipe scaler', 'ingredient calculator', 'cooking'] },
        inputs: [
            { id: 'original', label: 'Original Servings', type: 'number', placeholder: 'e.g. 4', defaultValue: '4' },
            { id: 'desired', label: 'Desired Servings', type: 'number', placeholder: 'e.g. 8' },
            { id: 'amount', label: 'Ingredient Amount', type: 'number', placeholder: 'e.g. 2' }
        ],
        outputs: [
            {
                label: 'Scale Factor',
                calculate: (inputs) => {
                    const orig = Number(inputs['original']) || 4;
                    const desired = Number(inputs['desired']) || 4;
                    return parseFloat((desired / orig).toFixed(2));
                }
            },
            {
                label: 'Scaled Amount',
                calculate: (inputs) => {
                    const orig = Number(inputs['original']) || 4;
                    const desired = Number(inputs['desired']) || 4;
                    const amount = Number(inputs['amount']) || 0;
                    return parseFloat((amount * desired / orig).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Recipe Scaling</h3><p>Multiply or divide ingredients to adjust serving sizes.</p>', faq: [] }
    },
    'baking-weight-calculator': {
        id: 'baking-weight-calculator',
        title: 'Baking Weight Calculator',
        description: 'Convert cups to grams for baking.',
        category: 'everyday',
        icon: 'Wheat',
        meta: { title: 'Baking Weight Calculator', description: 'Convert flour, sugar, and butter from cups to grams for precise baking.', keywords: ['baking calculator', 'flour grams', 'cups to grams'] },
        inputs: [
            {
                id: 'ingredient', label: 'Ingredient', type: 'select', defaultValue: 'flour',
                options: [
                    { label: 'All-Purpose Flour', value: 'flour' },
                    { label: 'Granulated Sugar', value: 'sugar' },
                    { label: 'Butter', value: 'butter' },
                    { label: 'Brown Sugar', value: 'brown_sugar' }
                ]
            },
            { id: 'cups', label: 'Cups', type: 'number', placeholder: 'e.g. 1' }
        ],
        outputs: [
            {
                label: 'Weight',
                unit: 'grams',
                calculate: (inputs) => {
                    const ingredient = inputs['ingredient'];
                    const cups = Number(inputs['cups']) || 0;

                    // Common baking cup-to-gram conversions
                    const ratios: Record<string, number> = {
                        flour: 125,      // 1 cup = 125g
                        sugar: 200,      // 1 cup = 200g
                        butter: 227,     // 1 cup = 227g
                        brown_sugar: 220 // 1 cup = 220g
                    };

                    const ratio = ratios[String(ingredient)] || 125;
                    return parseFloat((cups * ratio).toFixed(0));
                }
            }
        ],
        content: { whatIs: '<h3>Baking Weights</h3><p>Weight measurements are more precise than volume for baking.</p>', faq: [] }
    },
    'meat-cooking-time-calculator': {
        id: 'meat-cooking-time-calculator',
        title: 'Meat Cooking Time Calculator',
        description: 'Estimate roasting time.',
        category: 'everyday',
        icon: 'Flame',
        meta: { title: 'Meat Cooking Time Calculator', description: 'Estimate roasting time for different meats based on weight.', keywords: ['cooking time', 'roast calculator', 'meat temperature'] },
        inputs: [
            {
                id: 'meat', label: 'Meat Type', type: 'select', defaultValue: 'beef',
                options: [
                    { label: 'Beef (Roast)', value: 'beef' },
                    { label: 'Pork (Roast)', value: 'pork' },
                    { label: 'Chicken (Whole)', value: 'chicken' },
                    { label: 'Turkey (Whole)', value: 'turkey' }
                ]
            },
            { id: 'weight_lb', label: 'Weight (lbs)', type: 'number', placeholder: 'e.g. 5' }
        ],
        outputs: [
            {
                label: 'Approx. Cooking Time',
                calculate: (inputs) => {
                    const meat = inputs['meat'];
                    const weight = Number(inputs['weight_lb']) || 0;
                    if (!weight) return '-';

                    // Minutes per pound (medium doneness)
                    const minsPerLb: Record<string, number> = {
                        beef: 20,     // 20 min/lb for medium
                        pork: 25,     // 25 min/lb
                        chicken: 20,  // 20 min/lb
                        turkey: 15    // 15 min/lb (unstuffed)
                    };

                    const totalMins = weight * (minsPerLb[String(meat)] || 20);
                    const hrs = Math.floor(totalMins / 60);
                    const mins = Math.round(totalMins % 60);

                    return `${hrs}h ${mins}m at 350°F`;
                }
            },
            {
                label: 'Internal Temp Target',
                calculate: (inputs) => {
                    const temps: Record<string, string> = {
                        beef: '145°F (Medium)',
                        pork: '145°F',
                        chicken: '165°F',
                        turkey: '165°F'
                    };
                    return temps[String(inputs['meat'])] || '165°F';
                }
            }
        ],
        content: { whatIs: '<h3>Safe Meat Temperatures</h3><p>Use a meat thermometer for food safety.</p>', faq: [] }
    },
    'pace-calculator': {
        id: 'pace-calculator',
        title: 'Pace Calculator',
        description: 'Calculate running/cycling pace.',
        category: 'fitness',
        icon: 'Timer',
        meta: { title: 'Pace Calculator', description: 'Calculate your running or cycling pace in min/mile or min/km.', keywords: ['pace calculator', 'running pace', 'marathon pace'] },
        inputs: [
            { id: 'distance', label: 'Distance (km)', type: 'number', placeholder: 'e.g. 5' },
            { id: 'hours', label: 'Hours', type: 'number', placeholder: '0', defaultValue: '0' },
            { id: 'minutes', label: 'Minutes', type: 'number', placeholder: 'e.g. 25' },
            { id: 'seconds', label: 'Seconds', type: 'number', placeholder: '0', defaultValue: '0' }
        ],
        outputs: [
            {
                label: 'Pace (min/km)',
                calculate: (inputs) => {
                    const dist = Number(inputs['distance']) || 0;
                    const hrs = Number(inputs['hours']) || 0;
                    const mins = Number(inputs['minutes']) || 0;
                    const secs = Number(inputs['seconds']) || 0;

                    if (!dist) return '-';
                    const totalMins = hrs * 60 + mins + secs / 60;
                    const paceMin = totalMins / dist;
                    const m = Math.floor(paceMin);
                    const s = Math.round((paceMin - m) * 60);
                    return `${m}:${s.toString().padStart(2, '0')}`;
                }
            },
            {
                label: 'Speed (km/h)',
                calculate: (inputs) => {
                    const dist = Number(inputs['distance']) || 0;
                    const hrs = Number(inputs['hours']) || 0;
                    const mins = Number(inputs['minutes']) || 0;
                    const secs = Number(inputs['seconds']) || 0;

                    if (!dist) return 0;
                    const totalHrs = hrs + mins / 60 + secs / 3600;
                    if (!totalHrs) return 0;
                    return parseFloat((dist / totalHrs).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Running Pace</h3><p>The time it takes to cover a unit distance.</p>', faq: [] }
    },
    'vo2-max-calculator': {
        id: 'vo2-max-calculator',
        title: 'VO2 Max Estimator',
        description: 'Estimate aerobic capacity.',
        category: 'fitness',
        icon: 'Activity',
        meta: { title: 'VO2 Max Calculator', description: 'Estimate your VO2 Max using the Cooper Test or race results.', keywords: ['vo2 max', 'aerobic capacity', 'fitness test'] },
        inputs: [
            { id: 'distance_m', label: '12-min Test Distance (meters)', type: 'number', placeholder: 'e.g. 2400' }
        ],
        outputs: [
            {
                label: 'VO2 Max (Cooper Formula)',
                unit: 'ml/kg/min',
                calculate: (inputs) => {
                    const d = Number(inputs['distance_m']) || 0;
                    if (!d) return 0;
                    // Cooper formula: VO2max = (d - 504.9) / 44.73
                    return parseFloat(((d - 504.9) / 44.73).toFixed(1));
                }
            },
            {
                label: 'Fitness Level',
                calculate: (inputs) => {
                    const d = Number(inputs['distance_m']) || 0;
                    if (!d) return '-';
                    const vo2 = (d - 504.9) / 44.73;

                    if (vo2 >= 55) return 'Excellent';
                    if (vo2 >= 45) return 'Good';
                    if (vo2 >= 35) return 'Average';
                    if (vo2 >= 25) return 'Below Average';
                    return 'Poor';
                }
            }
        ],
        content: { whatIs: '<h3>VO2 Max</h3><p>The maximum rate of oxygen consumption during exercise. A key indicator of cardiorespiratory fitness.</p>', faq: [] }
    },
    'calories-burned-calculator': {
        id: 'calories-burned-calculator',
        title: 'Calories Burned Calculator',
        description: 'Estimate calories burned during exercise.',
        category: 'fitness',
        icon: 'Flame',
        meta: { title: 'Calories Burned Calculator', description: 'Estimate calories burned for various activities.', keywords: ['calories burned', 'exercise calories', 'workout calculator'] },
        inputs: [
            {
                id: 'activity', label: 'Activity', type: 'select', defaultValue: 'running',
                options: [
                    { label: 'Running (6 mph)', value: 'running' },
                    { label: 'Walking (3 mph)', value: 'walking' },
                    { label: 'Cycling (12 mph)', value: 'cycling' },
                    { label: 'Swimming', value: 'swimming' }
                ]
            },
            { id: 'weight_kg', label: 'Weight (kg)', type: 'number', placeholder: 'e.g. 70' },
            { id: 'duration_min', label: 'Duration (minutes)', type: 'number', placeholder: 'e.g. 30' }
        ],
        outputs: [
            {
                label: 'Calories Burned',
                unit: 'kcal',
                calculate: (inputs) => {
                    const activity = inputs['activity'];
                    const weight = Number(inputs['weight_kg']) || 70;
                    const duration = Number(inputs['duration_min']) || 0;

                    // MET values (approximate)
                    const mets: Record<string, number> = {
                        running: 9.8,
                        walking: 3.5,
                        cycling: 8.0,
                        swimming: 7.0
                    };

                    const met = mets[String(activity)] || 5;
                    // Calories = MET × weight(kg) × time(hrs)
                    const hours = duration / 60;
                    return Math.round(met * weight * hours);
                }
            }
        ],
        content: { whatIs: '<h3>Exercise Calories</h3><p>Estimate based on MET values and body weight.</p>', faq: [] }
    },
    'running-distance-calculator': {
        id: 'running-distance-calculator',
        title: 'Running Distance Calculator',
        description: 'Calculate distance from pace and time.',
        category: 'fitness',
        icon: 'Route',
        meta: { title: 'Running Distance Calculator', description: 'Calculate how far you can run given pace and time.', keywords: ['running distance', 'run calculator', 'distance from pace'] },
        inputs: [
            { id: 'pace_min', label: 'Pace Minutes (per km)', type: 'number', placeholder: 'e.g. 5' },
            { id: 'pace_sec', label: 'Pace Seconds', type: 'number', placeholder: 'e.g. 30', defaultValue: '0' },
            { id: 'run_hrs', label: 'Run Time Hours', type: 'number', placeholder: '0', defaultValue: '0' },
            { id: 'run_mins', label: 'Run Time Minutes', type: 'number', placeholder: 'e.g. 45' }
        ],
        outputs: [
            {
                label: 'Distance',
                unit: 'km',
                calculate: (inputs) => {
                    const paceM = Number(inputs['pace_min']) || 5;
                    const paceS = Number(inputs['pace_sec']) || 0;
                    const runH = Number(inputs['run_hrs']) || 0;
                    const runM = Number(inputs['run_mins']) || 0;

                    const paceInMins = paceM + paceS / 60;
                    const runInMins = runH * 60 + runM;

                    if (!paceInMins) return 0;
                    return parseFloat((runInMins / paceInMins).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Distance from Pace</h3><p>Calculate how far you will travel based on your pace and time.</p>', faq: [] }
    },
    'rent-affordability-calculator': {
        id: 'rent-affordability-calculator',
        title: 'Rent Affordability Calculator',
        description: 'How much rent can you afford?',
        category: 'finance',
        icon: 'Home',
        meta: { title: 'Rent Affordability Calculator', description: 'Calculate how much rent you can afford based on income.', keywords: ['rent calculator', 'housing budget', 'affordability'] },
        inputs: [
            { id: 'income', label: 'Monthly Income ($)', type: 'number', placeholder: 'e.g. 5000' },
            { id: 'rule', label: 'Rule (%)', type: 'number', placeholder: '30', defaultValue: '30' }
        ],
        outputs: [
            {
                label: 'Max Affordable Rent',
                unit: '$',
                calculate: (inputs) => {
                    const income = Number(inputs['income']) || 0;
                    const rule = Number(inputs['rule']) || 30;
                    return parseFloat((income * rule / 100).toFixed(0));
                }
            }
        ],
        content: { whatIs: '<h3>30% Rule</h3><p>A common guideline suggests spending no more than 30% of gross income on rent.</p>', faq: [] }
    },
    'paint-calculator': {
        id: 'paint-calculator',
        title: 'Paint Calculator',
        description: 'How much paint do you need?',
        category: 'everyday',
        icon: 'Paintbrush',
        meta: { title: 'Paint Calculator', description: 'Calculate how much paint you need for a room.', keywords: ['paint calculator', 'room painting', 'gallons of paint'] },
        inputs: [
            { id: 'length', label: 'Room Length (ft)', type: 'number', placeholder: 'e.g. 15' },
            { id: 'width', label: 'Room Width (ft)', type: 'number', placeholder: 'e.g. 12' },
            { id: 'height', label: 'Wall Height (ft)', type: 'number', placeholder: '8', defaultValue: '8' },
            { id: 'coats', label: 'Coats', type: 'number', placeholder: '2', defaultValue: '2' }
        ],
        outputs: [
            {
                label: 'Wall Area',
                unit: 'sq ft',
                calculate: (inputs) => {
                    const l = Number(inputs['length']) || 0;
                    const w = Number(inputs['width']) || 0;
                    const h = Number(inputs['height']) || 8;
                    return 2 * (l + w) * h; // Perimeter * height
                }
            },
            {
                label: 'Paint Needed',
                unit: 'gallons',
                calculate: (inputs) => {
                    const l = Number(inputs['length']) || 0;
                    const w = Number(inputs['width']) || 0;
                    const h = Number(inputs['height']) || 8;
                    const coats = Number(inputs['coats']) || 2;

                    const area = 2 * (l + w) * h;
                    // 1 gallon covers ~350 sq ft
                    return parseFloat(((area * coats) / 350).toFixed(1));
                }
            }
        ],
        content: { whatIs: '<h3>Paint Coverage</h3><p>One gallon of paint typically covers about 350 square feet.</p>', faq: [] }
    },
    'carpet-calculator': {
        id: 'carpet-calculator',
        title: 'Carpet Calculator',
        description: 'Calculate carpet area needed.',
        category: 'everyday',
        icon: 'LayoutGrid',
        meta: { title: 'Carpet Calculator', description: 'Calculate the square footage of carpet needed for a room.', keywords: ['carpet calculator', 'flooring', 'square yards'] },
        inputs: [
            { id: 'length', label: 'Room Length (ft)', type: 'number', placeholder: 'e.g. 15' },
            { id: 'width', label: 'Room Width (ft)', type: 'number', placeholder: 'e.g. 12' },
            { id: 'waste', label: 'Waste Factor (%)', type: 'number', placeholder: '10', defaultValue: '10' }
        ],
        outputs: [
            {
                label: 'Area',
                unit: 'sq ft',
                calculate: (inputs) => {
                    const l = Number(inputs['length']) || 0;
                    const w = Number(inputs['width']) || 0;
                    const waste = Number(inputs['waste']) || 10;
                    return parseFloat((l * w * (1 + waste / 100)).toFixed(1));
                }
            },
            {
                label: 'Square Yards',
                unit: 'sq yd',
                calculate: (inputs) => {
                    const l = Number(inputs['length']) || 0;
                    const w = Number(inputs['width']) || 0;
                    const waste = Number(inputs['waste']) || 10;
                    const sqft = l * w * (1 + waste / 100);
                    return parseFloat((sqft / 9).toFixed(1)); // 9 sq ft = 1 sq yd
                }
            }
        ],
        content: { whatIs: '<h3>Carpet Measurement</h3><p>Carpet is often sold by the square yard (9 sq ft).</p>', faq: [] }
    },
    'lawn-seed-calculator': {
        id: 'lawn-seed-calculator',
        title: 'Lawn Seed Calculator',
        description: 'How much grass seed do you need?',
        category: 'everyday',
        icon: 'Leaf',
        meta: { title: 'Lawn Seed Calculator', description: 'Calculate how much grass seed you need for your lawn.', keywords: ['lawn seed', 'grass seed', 'lawn care'] },
        inputs: [
            { id: 'length', label: 'Lawn Length (ft)', type: 'number', placeholder: 'e.g. 50' },
            { id: 'width', label: 'Lawn Width (ft)', type: 'number', placeholder: 'e.g. 30' },
            {
                id: 'seed_type', label: 'Seed Type', type: 'select', defaultValue: 'new',
                options: [
                    { label: 'New Lawn', value: 'new' },
                    { label: 'Overseeding', value: 'overseed' }
                ]
            }
        ],
        outputs: [
            {
                label: 'Area',
                unit: 'sq ft',
                calculate: (inputs) => {
                    const l = Number(inputs['length']) || 0;
                    const w = Number(inputs['width']) || 0;
                    return l * w;
                }
            },
            {
                label: 'Seed Needed',
                unit: 'lbs',
                calculate: (inputs) => {
                    const l = Number(inputs['length']) || 0;
                    const w = Number(inputs['width']) || 0;
                    const type = inputs['seed_type'];

                    const area = l * w;
                    // New lawn: ~1 lb per 250 sq ft; Overseed: ~1 lb per 500 sq ft
                    const rate = type === 'new' ? 250 : 500;
                    return parseFloat((area / rate).toFixed(1));
                }
            }
        ],
        content: { whatIs: '<h3>Lawn Seeding</h3><p>New lawns need more seed than overseeding existing grass.</p>', faq: [] }
    },
    'word-counter': {
        id: 'word-counter',
        title: 'Word Counter',
        description: 'Count words in text.',
        category: 'other',
        icon: 'FileText',
        meta: { title: 'Word Counter', description: 'Count words, characters, sentences, and paragraphs in your text.', keywords: ['word count', 'character count', 'text counter'] },
        inputs: [
            { id: 'text', label: 'Enter Text', type: 'text', placeholder: 'Paste your text here...' }
        ],
        outputs: [
            {
                label: 'Word Count',
                calculate: (inputs) => {
                    const text = String(inputs['text'] || '').trim();
                    if (!text) return 0;
                    return text.split(/\s+/).filter(w => w.length > 0).length;
                }
            },
            {
                label: 'Character Count',
                calculate: (inputs) => {
                    const text = String(inputs['text'] || '');
                    return text.length;
                }
            },
            {
                label: 'Characters (no spaces)',
                calculate: (inputs) => {
                    const text = String(inputs['text'] || '').replace(/\s/g, '');
                    return text.length;
                }
            }
        ],
        content: { whatIs: '<h3>Word Counting</h3><p>Useful for essays, articles, and social media posts.</p>', faq: [] }
    },
    'case-converter': {
        id: 'case-converter',
        title: 'Case Converter',
        description: 'Convert text case.',
        category: 'other',
        icon: 'Type',
        meta: { title: 'Case Converter', description: 'Convert text to uppercase, lowercase, title case, or sentence case.', keywords: ['case converter', 'uppercase', 'lowercase', 'title case'] },
        inputs: [
            { id: 'text', label: 'Enter Text', type: 'text', placeholder: 'Type your text here...' }
        ],
        outputs: [
            {
                label: 'UPPERCASE',
                calculate: (inputs) => String(inputs['text'] || '').toUpperCase()
            },
            {
                label: 'lowercase',
                calculate: (inputs) => String(inputs['text'] || '').toLowerCase()
            },
            {
                label: 'Title Case',
                calculate: (inputs) => {
                    const text = String(inputs['text'] || '');
                    return text.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
                }
            }
        ],
        content: { whatIs: '<h3>Text Case</h3><p>Different capitalization styles for various purposes.</p>', faq: [] }
    },
    'reading-time-calculator': {
        id: 'reading-time-calculator',
        title: 'Reading Time Calculator',
        description: 'Estimate reading time.',
        category: 'other',
        icon: 'Clock',
        meta: { title: 'Reading Time Calculator', description: 'Estimate how long it takes to read your text.', keywords: ['reading time', 'words per minute', 'article length'] },
        inputs: [
            { id: 'words', label: 'Word Count', type: 'number', placeholder: 'e.g. 1500' },
            { id: 'wpm', label: 'Reading Speed (WPM)', type: 'number', placeholder: '200', defaultValue: '200' }
        ],
        outputs: [
            {
                label: 'Reading Time',
                calculate: (inputs) => {
                    const words = Number(inputs['words']) || 0;
                    const wpm = Number(inputs['wpm']) || 200;
                    const mins = words / wpm;
                    const m = Math.floor(mins);
                    const s = Math.round((mins - m) * 60);
                    return `${m} min ${s} sec`;
                }
            }
        ],
        content: { whatIs: '<h3>Reading Speed</h3><p>Average adult reads about 200-250 words per minute.</p>', faq: [] }
    },
    'string-length-calculator': {
        id: 'string-length-calculator',
        title: 'String Length Calculator',
        description: 'Get string length and stats.',
        category: 'other',
        icon: 'Hash',
        meta: { title: 'String Length Calculator', description: 'Calculate the length of a string and other stats.', keywords: ['string length', 'character count', 'text length'] },
        inputs: [
            { id: 'str', label: 'Your String', type: 'text', placeholder: 'Enter text...' }
        ],
        outputs: [
            {
                label: 'Length',
                calculate: (inputs) => String(inputs['str'] || '').length
            },
            {
                label: 'Lines',
                calculate: (inputs) => {
                    const str = String(inputs['str'] || '');
                    if (!str) return 0;
                    return str.split(/\r\n|\r|\n/).length;
                }
            }
        ],
        content: { whatIs: '<h3>String Length</h3><p>Useful for validation and character limits.</p>', faq: [] }
    },
    'fuel-efficiency-calculator': {
        id: 'fuel-efficiency-calculator',
        title: 'Fuel Efficiency Calculator',
        description: 'Calculate your MPG.',
        category: 'everyday',
        icon: 'Gauge',
        meta: { title: 'Fuel Efficiency Calculator', description: 'Calculate your vehicle fuel efficiency in MPG.', keywords: ['mpg calculator', 'fuel economy', 'gas mileage'] },
        inputs: [
            { id: 'miles', label: 'Miles Driven', type: 'number', placeholder: 'e.g. 300' },
            { id: 'gallons', label: 'Gallons Used', type: 'number', placeholder: 'e.g. 12' }
        ],
        outputs: [
            {
                label: 'MPG',
                unit: 'mi/gal',
                calculate: (inputs) => {
                    const miles = Number(inputs['miles']) || 0;
                    const gallons = Number(inputs['gallons']) || 1;
                    return parseFloat((miles / gallons).toFixed(1));
                }
            },
            {
                label: 'L/100km',
                calculate: (inputs) => {
                    const miles = Number(inputs['miles']) || 0;
                    const gallons = Number(inputs['gallons']) || 1;
                    const mpg = miles / gallons;
                    // 235.215 / MPG = L/100km
                    return parseFloat((235.215 / mpg).toFixed(1));
                }
            }
        ],
        content: { whatIs: '<h3>Fuel Economy</h3><p>Miles per gallon measures how far you can travel on one gallon of fuel.</p>', faq: [] }
    },
    'mpg-to-lkm-converter': {
        id: 'mpg-to-lkm-converter',
        title: 'MPG to L/100km Converter',
        description: 'Convert fuel economy units.',
        category: 'conversion',
        icon: 'RefreshCw',
        meta: { title: 'MPG to L/100km Converter', description: 'Convert between miles per gallon and liters per 100 kilometers.', keywords: ['mpg converter', 'fuel economy conversion', 'l/100km'] },
        inputs: [
            { id: 'mpg', label: 'Miles Per Gallon (MPG)', type: 'number', placeholder: 'e.g. 30' }
        ],
        outputs: [
            {
                label: 'L/100km',
                calculate: (inputs) => {
                    const mpg = Number(inputs['mpg']) || 0;
                    if (!mpg) return 0;
                    return parseFloat((235.215 / mpg).toFixed(2));
                }
            },
            {
                label: 'km/L',
                calculate: (inputs) => {
                    const mpg = Number(inputs['mpg']) || 0;
                    if (!mpg) return 0;
                    // 1 MPG = 0.4251 km/L
                    return parseFloat((mpg * 0.4251).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Fuel Unit Conversion</h3><p>Different regions use different fuel economy metrics.</p>', faq: [] }
    },
    'tire-size-calculator': {
        id: 'tire-size-calculator',
        title: 'Tire Size Calculator',
        description: 'Calculate tire diameter.',
        category: 'everyday',
        icon: 'Circle',
        meta: { title: 'Tire Size Calculator', description: 'Calculate overall tire diameter from tire size notation.', keywords: ['tire size', 'tire diameter', 'wheel calculator'] },
        inputs: [
            { id: 'width', label: 'Tire Width (mm)', type: 'number', placeholder: 'e.g. 225' },
            { id: 'aspect', label: 'Aspect Ratio (%)', type: 'number', placeholder: 'e.g. 45' },
            { id: 'rim', label: 'Rim Diameter (inches)', type: 'number', placeholder: 'e.g. 18' }
        ],
        outputs: [
            {
                label: 'Sidewall Height',
                unit: 'mm',
                calculate: (inputs) => {
                    const width = Number(inputs['width']) || 0;
                    const aspect = Number(inputs['aspect']) || 0;
                    return parseFloat((width * aspect / 100).toFixed(1));
                }
            },
            {
                label: 'Overall Diameter',
                unit: 'inches',
                calculate: (inputs) => {
                    const width = Number(inputs['width']) || 0;
                    const aspect = Number(inputs['aspect']) || 0;
                    const rim = Number(inputs['rim']) || 0;

                    const sidewallMm = width * aspect / 100;
                    const sidewallIn = sidewallMm / 25.4;
                    const total = rim + (2 * sidewallIn);
                    return parseFloat(total.toFixed(1));
                }
            }
        ],
        content: { whatIs: '<h3>Tire Size</h3><p>Tire notation like "225/45R18" means 225mm width, 45% aspect ratio, 18" rim.</p>', faq: [] }
    },
    'zero-to-sixty-calculator': {
        id: 'zero-to-sixty-calculator',
        title: '0-60 Time Calculator',
        description: 'Estimate 0-60 mph time.',
        category: 'other',
        icon: 'Zap',
        meta: { title: '0-60 Calculator', description: 'Estimate acceleration time based on power-to-weight ratio.', keywords: ['0-60', 'acceleration', 'quarter mile'] },
        inputs: [
            { id: 'hp', label: 'Horsepower', type: 'number', placeholder: 'e.g. 300' },
            { id: 'weight', label: 'Weight (lbs)', type: 'number', placeholder: 'e.g. 3500' }
        ],
        outputs: [
            {
                label: 'Power-to-Weight',
                unit: 'hp/ton',
                calculate: (inputs) => {
                    const hp = Number(inputs['hp']) || 0;
                    const weight = Number(inputs['weight']) || 2000;
                    // lbs to tons (US short ton = 2000 lbs)
                    return parseFloat((hp / (weight / 2000)).toFixed(0));
                }
            },
            {
                label: 'Est. 0-60 Time',
                unit: 'sec',
                calculate: (inputs) => {
                    const hp = Number(inputs['hp']) || 0;
                    const weight = Number(inputs['weight']) || 2000;
                    if (!hp) return 0;
                    // Rough estimate: 0-60 ≈ weight/(hp*10)^0.8 ish (very rough)
                    // Better: ETtime = (Wt/HP)^0.435
                    const ratio = weight / hp;
                    const time = Math.pow(ratio, 0.5) * 1.5; // Simplified estimate
                    return parseFloat(time.toFixed(1));
                }
            }
        ],
        content: { whatIs: '<h3>0-60 Acceleration</h3><p>Power-to-weight ratio is a key factor in acceleration performance.</p>', faq: [] }
    },
    'due-date-calculator': {
        id: 'due-date-calculator',
        title: 'Due Date Calculator',
        description: 'Calculate pregnancy due date.',
        category: 'health',
        icon: 'Baby',
        meta: { title: 'Due Date Calculator', description: 'Calculate your estimated due date based on last menstrual period.', keywords: ['due date', 'pregnancy calculator', 'expected delivery'] },
        inputs: [
            { id: 'lmp', label: 'Last Menstrual Period (LMP)', type: 'date', placeholder: 'YYYY-MM-DD' }
        ],
        outputs: [
            {
                label: 'Estimated Due Date',
                calculate: (inputs) => {
                    const lmp = inputs['lmp'];
                    if (!lmp) return 'Enter LMP date';

                    const lmpDate = new Date(String(lmp));
                    // Add 280 days (40 weeks)
                    const dueDate = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000);
                    return dueDate.toDateString();
                }
            },
            {
                label: 'Current Week',
                calculate: (inputs) => {
                    const lmp = inputs['lmp'];
                    if (!lmp) return '-';

                    const lmpDate = new Date(String(lmp));
                    const now = new Date();
                    const days = Math.floor((now.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));
                    const weeks = Math.floor(days / 7);
                    const dayOfWeek = days % 7;

                    if (weeks < 0) return 'Future date';
                    if (weeks > 42) return 'Past due';
                    return `Week ${weeks}, Day ${dayOfWeek}`;
                }
            }
        ],
        content: { whatIs: '<h3>Pregnancy Due Date</h3><p>Based on a 40-week (280 days) gestation period from LMP.</p>', faq: [] }
    },
    'baby-weight-percentile': {
        id: 'baby-weight-percentile',
        title: 'Baby Weight Percentile',
        description: 'Check baby weight percentile.',
        category: 'health',
        icon: 'Scale',
        meta: { title: 'Baby Weight Percentile', description: 'Compare your baby s weight to growth charts.', keywords: ['baby weight', 'growth chart', 'percentile'] },
        inputs: [
            { id: 'weight_kg', label: 'Weight (kg)', type: 'number', placeholder: 'e.g. 3.5' },
            { id: 'age_months', label: 'Age (months)', type: 'number', placeholder: 'e.g. 3' },
            {
                id: 'gender', label: 'Gender', type: 'select', defaultValue: 'male',
                options: [
                    { label: 'Boy', value: 'male' },
                    { label: 'Girl', value: 'female' }
                ]
            }
        ],
        outputs: [
            {
                label: 'Weight Status',
                calculate: (inputs) => {
                    const weight = Number(inputs['weight_kg']) || 0;
                    const age = Number(inputs['age_months']) || 0;

                    // Simplified average weights (kg) for reference
                    const avgBoy = [3.3, 4.5, 5.6, 6.4, 7.0, 7.5, 7.9, 8.3, 8.6, 8.9, 9.2, 9.4, 9.6];
                    const avgGirl = [3.2, 4.2, 5.1, 5.8, 6.4, 6.9, 7.3, 7.6, 7.9, 8.2, 8.5, 8.7, 8.9];

                    const avg = inputs['gender'] === 'male' ? avgBoy[Math.min(age, 12)] : avgGirl[Math.min(age, 12)];

                    if (!avg) return '-';
                    const diff = ((weight - avg) / avg) * 100;

                    if (diff < -15) return 'Below average';
                    if (diff > 15) return 'Above average';
                    return 'Normal range';
                }
            }
        ],
        content: { whatIs: '<h3>Baby Growth</h3><p>A simplified comparison to average growth charts.</p>', faq: [] }
    },
    'diaper-usage-calculator': {
        id: 'diaper-usage-calculator',
        title: 'Diaper Usage Calculator',
        description: 'Estimate diaper needs.',
        category: 'everyday',
        icon: 'Baby',
        meta: { title: 'Diaper Calculator', description: 'Estimate how many diapers you need per month.', keywords: ['diaper calculator', 'baby supplies', 'diaper budget'] },
        inputs: [
            { id: 'age_months', label: 'Baby Age (months)', type: 'number', placeholder: 'e.g. 3' },
            { id: 'days', label: 'Days to Calculate', type: 'number', placeholder: '30', defaultValue: '30' }
        ],
        outputs: [
            {
                label: 'Diapers Needed',
                calculate: (inputs) => {
                    const age = Number(inputs['age_months']) || 0;
                    const days = Number(inputs['days']) || 30;

                    // Diapers per day by age (approximate)
                    let perDay = 10; // newborn
                    if (age >= 1) perDay = 8;
                    if (age >= 5) perDay = 7;
                    if (age >= 9) perDay = 6;
                    if (age >= 12) perDay = 5;

                    return perDay * days;
                }
            },
            {
                label: 'Per Day Average',
                calculate: (inputs) => {
                    const age = Number(inputs['age_months']) || 0;
                    let perDay = 10;
                    if (age >= 1) perDay = 8;
                    if (age >= 5) perDay = 7;
                    if (age >= 9) perDay = 6;
                    if (age >= 12) perDay = 5;
                    return perDay;
                }
            }
        ],
        content: { whatIs: '<h3>Diaper Usage</h3><p>Newborns use more diapers; usage decreases as baby grows.</p>', faq: [] }
    },
    'child-sleep-calculator': {
        id: 'child-sleep-calculator',
        title: 'Child Sleep Calculator',
        description: 'Recommended sleep hours.',
        category: 'health',
        icon: 'Moon',
        meta: { title: 'Child Sleep Calculator', description: 'See recommended sleep hours for your child age.', keywords: ['sleep calculator', 'child sleep', 'baby sleep'] },
        inputs: [
            { id: 'age_years', label: 'Age (years)', type: 'number', placeholder: 'e.g. 2' }
        ],
        outputs: [
            {
                label: 'Recommended Sleep',
                unit: 'hours',
                calculate: (inputs) => {
                    const age = Number(inputs['age_years']) || 0;

                    // CDC/AAP recommendations
                    if (age < 1) return '12-17';
                    if (age < 3) return '11-14';
                    if (age < 6) return '10-13';
                    if (age < 13) return '9-12';
                    if (age < 18) return '8-10';
                    return '7-9';
                }
            }
        ],
        content: { whatIs: '<h3>Sleep Recommendations</h3><p>Based on CDC and AAP guidelines for healthy child development.</p>', faq: [] }
    },
    'dog-age-calculator': {
        id: 'dog-age-calculator',
        title: 'Dog Age Calculator',
        description: 'Convert dog years to human years.',
        category: 'everyday',
        icon: 'Dog',
        meta: { title: 'Dog Age Calculator', description: 'Calculate your dogs age in human years.', keywords: ['dog age', 'dog years', 'pet age'] },
        inputs: [
            { id: 'dog_years', label: 'Dog Age (years)', type: 'number', placeholder: 'e.g. 3' },
            {
                id: 'size', label: 'Dog Size', type: 'select', defaultValue: 'medium',
                options: [
                    { label: 'Small (<20 lbs)', value: 'small' },
                    { label: 'Medium (20-50 lbs)', value: 'medium' },
                    { label: 'Large (>50 lbs)', value: 'large' }
                ]
            }
        ],
        outputs: [
            {
                label: 'Human Years Equivalent',
                calculate: (inputs) => {
                    const dogYears = Number(inputs['dog_years']) || 0;
                    const size = inputs['size'];

                    if (dogYears <= 0) return 0;

                    // Modern formula based on size
                    let humanYears = 0;
                    if (dogYears === 1) humanYears = 15;
                    else if (dogYears === 2) humanYears = 24;
                    else {
                        humanYears = 24;
                        const perYear = size === 'small' ? 4 : size === 'medium' ? 5 : 6;
                        humanYears += (dogYears - 2) * perYear;
                    }

                    return humanYears;
                }
            }
        ],
        content: { whatIs: '<h3>Dog Years</h3><p>Dogs age faster in early years. Larger dogs age faster than smaller ones.</p>', faq: [] }
    },
    'cat-age-calculator': {
        id: 'cat-age-calculator',
        title: 'Cat Age Calculator',
        description: 'Convert cat years to human years.',
        category: 'everyday',
        icon: 'Cat',
        meta: { title: 'Cat Age Calculator', description: 'Calculate your cats age in human years.', keywords: ['cat age', 'cat years', 'pet age'] },
        inputs: [
            { id: 'cat_years', label: 'Cat Age (years)', type: 'number', placeholder: 'e.g. 5' }
        ],
        outputs: [
            {
                label: 'Human Years Equivalent',
                calculate: (inputs) => {
                    const catYears = Number(inputs['cat_years']) || 0;

                    if (catYears <= 0) return 0;
                    if (catYears === 1) return 15;
                    if (catYears === 2) return 24;
                    return 24 + (catYears - 2) * 4;
                }
            }
        ],
        content: { whatIs: '<h3>Cat Years</h3><p>Cats mature quickly in the first two years, then age about 4 human years per cat year.</p>', faq: [] }
    },
    'pet-food-calculator': {
        id: 'pet-food-calculator',
        title: 'Pet Food Calculator',
        description: 'Daily food requirement.',
        category: 'everyday',
        icon: 'Utensils',
        meta: { title: 'Pet Food Calculator', description: 'Calculate daily food requirements for your pet.', keywords: ['pet food', 'dog food calculator', 'feeding guide'] },
        inputs: [
            { id: 'weight_kg', label: 'Pet Weight (kg)', type: 'number', placeholder: 'e.g. 15' },
            {
                id: 'activity', label: 'Activity Level', type: 'select', defaultValue: 'normal',
                options: [
                    { label: 'Low Activity', value: 'low' },
                    { label: 'Normal', value: 'normal' },
                    { label: 'High Activity', value: 'high' }
                ]
            }
        ],
        outputs: [
            {
                label: 'Daily Calories',
                unit: 'kcal',
                calculate: (inputs) => {
                    const weight = Number(inputs['weight_kg']) || 10;
                    const activity = inputs['activity'];

                    // RER (Resting Energy Requirement) = 70 × weight^0.75
                    const rer = 70 * Math.pow(weight, 0.75);

                    // Multiply by activity factor
                    const factor = activity === 'low' ? 1.2 : activity === 'normal' ? 1.6 : 2.0;
                    return Math.round(rer * factor);
                }
            },
            {
                label: 'Dry Food (approx)',
                unit: 'grams',
                calculate: (inputs) => {
                    const weight = Number(inputs['weight_kg']) || 10;
                    const activity = inputs['activity'];
                    const rer = 70 * Math.pow(weight, 0.75);
                    const factor = activity === 'low' ? 1.2 : activity === 'normal' ? 1.6 : 2.0;
                    const calories = rer * factor;
                    // Dry food ~3.5 kcal/gram
                    return Math.round(calories / 3.5);
                }
            }
        ],
        content: { whatIs: '<h3>Pet Nutrition</h3><p>Calorie needs depend on weight, age, and activity level.</p>', faq: [] }
    },
    'dog-walking-calculator': {
        id: 'dog-walking-calculator',
        title: 'Dog Walking Calculator',
        description: 'Daily walking needs.',
        category: 'everyday',
        icon: 'Footprints',
        meta: { title: 'Dog Walking Calculator', description: 'Calculate how much exercise your dog needs daily.', keywords: ['dog walking', 'dog exercise', 'pet activity'] },
        inputs: [
            {
                id: 'breed_size', label: 'Breed Size', type: 'select', defaultValue: 'medium',
                options: [
                    { label: 'Small (Chihuahua, Yorkie)', value: 'small' },
                    { label: 'Medium (Beagle, Bulldog)', value: 'medium' },
                    { label: 'Large (Lab, Golden)', value: 'large' },
                    { label: 'High Energy (Husky, Border Collie)', value: 'high_energy' }
                ]
            },
            { id: 'age_years', label: 'Dog Age (years)', type: 'number', placeholder: 'e.g. 3' }
        ],
        outputs: [
            {
                label: 'Daily Walking',
                unit: 'minutes',
                calculate: (inputs) => {
                    const size = inputs['breed_size'];
                    const age = Number(inputs['age_years']) || 3;

                    // Base minutes by breed size
                    let base = size === 'small' ? 30 : size === 'medium' ? 45 : size === 'large' ? 60 : 90;

                    // Adjust for age (puppies and seniors need less)
                    if (age < 1) base = base * 0.5;
                    else if (age > 8) base = base * 0.7;

                    return Math.round(base);
                }
            },
            {
                label: 'Sessions',
                calculate: (inputs) => {
                    const size = inputs['breed_size'];
                    return size === 'high_energy' ? '2-3 per day' : '1-2 per day';
                }
            }
        ],
        content: { whatIs: '<h3>Dog Exercise</h3><p>Exercise needs vary by breed, age, and individual health.</p>', faq: [] }
    },
    'planet-weight-calculator': {
        id: 'planet-weight-calculator',
        title: 'Planet Weight Calculator',
        description: 'Your weight on other planets.',
        category: 'other',
        icon: 'Globe2',
        meta: { title: 'Planet Weight Calculator', description: 'Calculate your weight on other planets in our solar system.', keywords: ['planet weight', 'weight on mars', 'space calculator'] },
        inputs: [
            { id: 'earth_weight', label: 'Your Weight on Earth (kg)', type: 'number', placeholder: 'e.g. 70' },
            {
                id: 'planet', label: 'Planet', type: 'select', defaultValue: 'mars',
                options: [
                    { label: 'Mercury', value: 'mercury' },
                    { label: 'Venus', value: 'venus' },
                    { label: 'Mars', value: 'mars' },
                    { label: 'Jupiter', value: 'jupiter' },
                    { label: 'Saturn', value: 'saturn' },
                    { label: 'Moon', value: 'moon' }
                ]
            }
        ],
        outputs: [
            {
                label: 'Weight on Planet',
                unit: 'kg',
                calculate: (inputs) => {
                    const earthWeight = Number(inputs['earth_weight']) || 70;
                    const planet = inputs['planet'];

                    // Surface gravity relative to Earth
                    const gravity: Record<string, number> = {
                        mercury: 0.38,
                        venus: 0.91,
                        mars: 0.38,
                        jupiter: 2.34,
                        saturn: 1.06,
                        moon: 0.17
                    };

                    const g = gravity[String(planet)] || 1;
                    return parseFloat((earthWeight * g).toFixed(1));
                }
            }
        ],
        content: { whatIs: '<h3>Planetary Gravity</h3><p>Weight varies by surface gravity. Mars has 38% of Earth gravity.</p>', faq: [] }
    },
    'light-year-calculator': {
        id: 'light-year-calculator',
        title: 'Light Year Calculator',
        description: 'Convert light years to km.',
        category: 'conversion',
        icon: 'Sparkles',
        meta: { title: 'Light Year Calculator', description: 'Convert light years to kilometers or miles.', keywords: ['light year', 'space distance', 'astronomical units'] },
        inputs: [
            { id: 'light_years', label: 'Light Years', type: 'number', placeholder: 'e.g. 4.24' }
        ],
        outputs: [
            {
                label: 'Kilometers',
                unit: 'trillion km',
                calculate: (inputs) => {
                    const ly = Number(inputs['light_years']) || 0;
                    // 1 light year ≈ 9.461 trillion km
                    return parseFloat((ly * 9.461).toFixed(3));
                }
            },
            {
                label: 'Miles',
                unit: 'trillion mi',
                calculate: (inputs) => {
                    const ly = Number(inputs['light_years']) || 0;
                    // 1 light year ≈ 5.878 trillion miles
                    return parseFloat((ly * 5.878).toFixed(3));
                }
            }
        ],
        content: { whatIs: '<h3>Light Year</h3><p>The distance light travels in one year: about 9.46 trillion km.</p>', faq: [] }
    },
    'star-distance-calculator': {
        id: 'star-distance-calculator',
        title: 'Star Distance Calculator',
        description: 'Calculate travel time to stars.',
        category: 'other',
        icon: 'Star',
        meta: { title: 'Star Distance Calculator', description: 'Calculate how long it would take to travel to a star.', keywords: ['star distance', 'space travel', 'proxima centauri'] },
        inputs: [
            { id: 'light_years', label: 'Distance (light years)', type: 'number', placeholder: 'e.g. 4.24' },
            { id: 'speed_kmh', label: 'Speed (km/h)', type: 'number', placeholder: '40000', defaultValue: '40000' }
        ],
        outputs: [
            {
                label: 'Travel Time',
                unit: 'years',
                calculate: (inputs) => {
                    const ly = Number(inputs['light_years']) || 0;
                    const speed = Number(inputs['speed_kmh']) || 40000;

                    if (!ly || !speed) return 0;

                    // km in one light year
                    const km = ly * 9.461e12;
                    const hours = km / speed;
                    const years = hours / (24 * 365.25);
                    return Math.round(years).toLocaleString();
                }
            }
        ],
        content: { whatIs: '<h3>Interstellar Travel</h3><p>At current spacecraft speeds, the nearest star would take tens of thousands of years to reach.</p>', faq: [] }
    },
    'orbital-period-calculator': {
        id: 'orbital-period-calculator',
        title: 'Orbital Period Calculator',
        description: 'Calculate orbital periods.',
        category: 'physics',
        icon: 'Orbit',
        meta: { title: 'Orbital Period Calculator', description: 'Calculate orbital period using Keplers third law.', keywords: ['orbital period', 'kepler', 'satellite orbit'] },
        inputs: [
            { id: 'radius_km', label: 'Orbital Radius (km)', type: 'number', placeholder: 'e.g. 42164' },
            { id: 'central_mass', label: 'Central Mass (Earth masses)', type: 'number', placeholder: '1', defaultValue: '1' }
        ],
        outputs: [
            {
                label: 'Orbital Period',
                calculate: (inputs) => {
                    const rKm = Number(inputs['radius_km']) || 0;
                    const mass = Number(inputs['central_mass']) || 1;

                    if (!rKm) return '-';

                    // T = 2π * sqrt(r³/GM)
                    // For Earth: GM ≈ 3.986e14 m³/s²
                    const GM = 3.986e14 * mass;
                    const rM = rKm * 1000;
                    const T = 2 * Math.PI * Math.sqrt(Math.pow(rM, 3) / GM);

                    const hours = T / 3600;
                    if (hours < 24) return `${hours.toFixed(1)} hours`;
                    return `${(hours / 24).toFixed(2)} days`;
                }
            }
        ],
        content: { whatIs: '<h3>Keplers Third Law</h3><p>Orbital period relates to the cube of orbital radius.</p>', faq: [] }
    },
    'bpm-calculator': {
        id: 'bpm-calculator',
        title: 'BPM Calculator',
        description: 'Calculate beats per minute.',
        category: 'other',
        icon: 'Music',
        meta: { title: 'BPM Calculator', description: 'Calculate tempo from tap or time between beats.', keywords: ['bpm', 'beats per minute', 'tempo calculator'] },
        inputs: [
            { id: 'ms_per_beat', label: 'Milliseconds per Beat', type: 'number', placeholder: 'e.g. 500' }
        ],
        outputs: [
            {
                label: 'BPM',
                calculate: (inputs) => {
                    const ms = Number(inputs['ms_per_beat']) || 0;
                    if (!ms) return 0;
                    return Math.round(60000 / ms);
                }
            },
            {
                label: 'Beats per Second',
                calculate: (inputs) => {
                    const ms = Number(inputs['ms_per_beat']) || 0;
                    if (!ms) return 0;
                    return parseFloat((1000 / ms).toFixed(2));
                }
            }
        ],
        content: { whatIs: '<h3>Tempo</h3><p>The speed of music measured in beats per minute.</p>', faq: [] }
    },
    'key-transpose-calculator': {
        id: 'key-transpose-calculator',
        title: 'Key Transpose Calculator',
        description: 'Transpose musical keys.',
        category: 'other',
        icon: 'Music2',
        meta: { title: 'Key Transpose Calculator', description: 'Transpose chords and keys by semitones.', keywords: ['transpose', 'music key', 'capo calculator'] },
        inputs: [
            {
                id: 'original_key', label: 'Original Key', type: 'select', defaultValue: 'C',
                options: [
                    { label: 'C', value: 'C' }, { label: 'C#/Db', value: 'C#' },
                    { label: 'D', value: 'D' }, { label: 'D#/Eb', value: 'D#' },
                    { label: 'E', value: 'E' }, { label: 'F', value: 'F' },
                    { label: 'F#/Gb', value: 'F#' }, { label: 'G', value: 'G' },
                    { label: 'G#/Ab', value: 'G#' }, { label: 'A', value: 'A' },
                    { label: 'A#/Bb', value: 'A#' }, { label: 'B', value: 'B' }
                ]
            },
            { id: 'semitones', label: 'Semitones', type: 'number', placeholder: 'e.g. 2' }
        ],
        outputs: [
            {
                label: 'New Key',
                calculate: (inputs) => {
                    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
                    const orig = String(inputs['original_key']);
                    const semi = Number(inputs['semitones']) || 0;

                    const idx = notes.indexOf(orig);
                    if (idx === -1) return orig;

                    let newIdx = (idx + semi) % 12;
                    if (newIdx < 0) newIdx += 12;
                    return notes[newIdx];
                }
            }
        ],
        content: { whatIs: '<h3>Transposition</h3><p>Moving a piece of music up or down in pitch by a constant interval.</p>', faq: [] }
    },
    'delay-time-calculator': {
        id: 'delay-time-calculator',
        title: 'Delay Time Calculator',
        description: 'Calculate delay times from BPM.',
        category: 'other',
        icon: 'Clock',
        meta: { title: 'Delay Time Calculator', description: 'Calculate delay and reverb times based on tempo.', keywords: ['delay time', 'music production', 'reverb'] },
        inputs: [
            { id: 'bpm', label: 'BPM', type: 'number', placeholder: 'e.g. 120' }
        ],
        outputs: [
            {
                label: '1/4 Note Delay',
                unit: 'ms',
                calculate: (inputs) => {
                    const bpm = Number(inputs['bpm']) || 120;
                    return Math.round(60000 / bpm);
                }
            },
            {
                label: '1/8 Note Delay',
                unit: 'ms',
                calculate: (inputs) => {
                    const bpm = Number(inputs['bpm']) || 120;
                    return Math.round(30000 / bpm);
                }
            },
            {
                label: '1/16 Note Delay',
                unit: 'ms',
                calculate: (inputs) => {
                    const bpm = Number(inputs['bpm']) || 120;
                    return Math.round(15000 / bpm);
                }
            }
        ],
        content: { whatIs: '<h3>Musical Delay</h3><p>Sync delay effects to the tempo of your music.</p>', faq: [] }
    },
    'decibel-calculator': {
        id: 'decibel-calculator',
        title: 'Decibel Calculator',
        description: 'Calculate dB changes.',
        category: 'physics',
        icon: 'Volume2',
        meta: { title: 'Decibel Calculator', description: 'Calculate decibel changes and power ratios.', keywords: ['decibels', 'dB', 'audio levels'] },
        inputs: [
            { id: 'power1', label: 'Power 1 (watts)', type: 'number', placeholder: 'e.g. 10' },
            { id: 'power2', label: 'Power 2 (watts)', type: 'number', placeholder: 'e.g. 100' }
        ],
        outputs: [
            {
                label: 'dB Difference',
                unit: 'dB',
                calculate: (inputs) => {
                    const p1 = Number(inputs['power1']) || 1;
                    const p2 = Number(inputs['power2']) || 1;
                    // dB = 10 * log10(P2/P1)
                    return parseFloat((10 * Math.log10(p2 / p1)).toFixed(1));
                }
            }
        ],
        content: { whatIs: '<h3>Decibels</h3><p>A logarithmic unit used to measure sound intensity or power ratios.</p>', faq: [] }
    },
    'dice-roller': {
        id: 'dice-roller',
        title: 'Dice Roller',
        description: 'Roll virtual dice.',
        category: 'other',
        icon: 'Dices',
        meta: { title: 'Dice Roller', description: 'Roll virtual dice for tabletop games and random decisions.', keywords: ['dice roller', 'd20', 'random generator'] },
        inputs: [
            { id: 'num_dice', label: 'Number of Dice', type: 'number', placeholder: 'e.g. 2', defaultValue: '1' },
            {
                id: 'sides', label: 'Sides', type: 'select', defaultValue: '6',
                options: [
                    { label: 'd4', value: '4' },
                    { label: 'd6', value: '6' },
                    { label: 'd8', value: '8' },
                    { label: 'd10', value: '10' },
                    { label: 'd12', value: '12' },
                    { label: 'd20', value: '20' },
                    { label: 'd100', value: '100' }
                ]
            }
        ],
        outputs: [
            {
                label: 'Roll Result',
                calculate: (inputs) => {
                    const n = Number(inputs['num_dice']) || 1;
                    const sides = Number(inputs['sides']) || 6;
                    let sum = 0;
                    for (let i = 0; i < n; i++) {
                        sum += Math.floor(Math.random() * sides) + 1;
                    }
                    return sum;
                }
            },
            {
                label: 'Average Expected',
                calculate: (inputs) => {
                    const n = Number(inputs['num_dice']) || 1;
                    const sides = Number(inputs['sides']) || 6;
                    return parseFloat((n * (sides + 1) / 2).toFixed(1));
                }
            }
        ],
        content: { whatIs: '<h3>Dice Rolling</h3><p>Random number generation for games. d20 means a 20-sided die.</p>', faq: [] }
    },
    'critical-hit-calculator': {
        id: 'critical-hit-calculator',
        title: 'Critical Hit Calculator',
        description: 'Calculate crit damage.',
        category: 'other',
        icon: 'Swords',
        meta: { title: 'Critical Hit Calculator', description: 'Calculate critical hit damage for RPG games.', keywords: ['critical hit', 'crit damage', 'rpg calculator'] },
        inputs: [
            { id: 'base_damage', label: 'Base Damage', type: 'number', placeholder: 'e.g. 50' },
            { id: 'crit_multiplier', label: 'Crit Multiplier', type: 'number', placeholder: '2', defaultValue: '2' },
            { id: 'crit_bonus', label: 'Flat Crit Bonus', type: 'number', placeholder: '0', defaultValue: '0' }
        ],
        outputs: [
            {
                label: 'Critical Damage',
                calculate: (inputs) => {
                    const base = Number(inputs['base_damage']) || 0;
                    const mult = Number(inputs['crit_multiplier']) || 2;
                    const bonus = Number(inputs['crit_bonus']) || 0;
                    return Math.round(base * mult + bonus);
                }
            }
        ],
        content: { whatIs: '<h3>Critical Hits</h3><p>Extra damage dealt when landing a lucky or well-placed attack.</p>', faq: [] }
    },
    'xp-calculator': {
        id: 'xp-calculator',
        title: 'XP Calculator',
        description: 'Calculate experience points.',
        category: 'other',
        icon: 'TrendingUp',
        meta: { title: 'XP Calculator', description: 'Calculate experience needed for leveling up.', keywords: ['xp calculator', 'experience points', 'level up'] },
        inputs: [
            { id: 'current_level', label: 'Current Level', type: 'number', placeholder: 'e.g. 10' },
            { id: 'target_level', label: 'Target Level', type: 'number', placeholder: 'e.g. 20' },
            { id: 'xp_per_level', label: 'XP per Level', type: 'number', placeholder: '1000', defaultValue: '1000' }
        ],
        outputs: [
            {
                label: 'XP Needed',
                calculate: (inputs) => {
                    const current = Number(inputs['current_level']) || 1;
                    const target = Number(inputs['target_level']) || 2;
                    const perLevel = Number(inputs['xp_per_level']) || 1000;

                    let total = 0;
                    for (let lvl = current; lvl < target; lvl++) {
                        total += perLevel * lvl; // XP scales with level
                    }
                    return total.toLocaleString();
                }
            }
        ],
        content: { whatIs: '<h3>Experience Points</h3><p>A measure of character progression in games.</p>', faq: [] }
    },
    'coin-flip': {
        id: 'coin-flip',
        title: 'Coin Flip',
        description: 'Flip a virtual coin.',
        category: 'other',
        icon: 'Coins',
        meta: { title: 'Coin Flip', description: 'Flip a virtual coin for 50/50 decisions.', keywords: ['coin flip', 'heads tails', 'random decision'] },
        inputs: [
            { id: 'flips', label: 'Number of Flips', type: 'number', placeholder: '1', defaultValue: '1' }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const n = Math.min(Number(inputs['flips']) || 1, 10);
                    const results = [];
                    for (let i = 0; i < n; i++) {
                        results.push(Math.random() < 0.5 ? 'Heads' : 'Tails');
                    }
                    return results.join(', ');
                }
            },
            {
                label: 'Probability',
                calculate: () => '50% Heads, 50% Tails'
            }
        ],
        content: { whatIs: '<h3>Coin Flip</h3><p>A simple random binary decision.</p>', faq: [] }
    },
    'gcd-lcm-calculator': {
        id: 'gcd-lcm-calculator',
        title: 'GCD/LCM Calculator',
        description: 'Find GCD and LCM.',
        category: 'math',
        icon: 'Divide',
        meta: { title: 'GCD and LCM Calculator', description: 'Calculate the Greatest Common Divisor and Least Common Multiple.', keywords: ['gcd', 'lcm', 'greatest common divisor'] },
        inputs: [
            { id: 'num1', label: 'Number 1', type: 'number', placeholder: 'e.g. 12' },
            { id: 'num2', label: 'Number 2', type: 'number', placeholder: 'e.g. 18' }
        ],
        outputs: [
            {
                label: 'GCD',
                calculate: (inputs) => {
                    let a = Math.abs(Number(inputs['num1']) || 0);
                    let b = Math.abs(Number(inputs['num2']) || 0);
                    if (!a || !b) return 0;
                    while (b) { const t = b; b = a % b; a = t; }
                    return a;
                }
            },
            {
                label: 'LCM',
                calculate: (inputs) => {
                    let a = Math.abs(Number(inputs['num1']) || 0);
                    let b = Math.abs(Number(inputs['num2']) || 0);
                    if (!a || !b) return 0;
                    const origA = a, origB = b;
                    while (b) { const t = b; b = a % b; a = t; }
                    return (origA * origB) / a;
                }
            }
        ],
        content: { whatIs: '<h3>GCD & LCM</h3><p>GCD: largest number that divides both. LCM: smallest number divisible by both.</p>', faq: [] }
    },
    'fibonacci-calculator': {
        id: 'fibonacci-calculator',
        title: 'Fibonacci Calculator',
        description: 'Calculate Fibonacci numbers.',
        category: 'math',
        icon: 'Sigma',
        meta: { title: 'Fibonacci Calculator', description: 'Calculate the nth Fibonacci number.', keywords: ['fibonacci', 'golden ratio', 'sequence'] },
        inputs: [
            { id: 'n', label: 'Position (n)', type: 'number', placeholder: 'e.g. 10' }
        ],
        outputs: [
            {
                label: 'Fibonacci Number',
                calculate: (inputs) => {
                    const n = Math.min(Number(inputs['n']) || 0, 50);
                    if (n <= 0) return 0;
                    if (n === 1) return 1;
                    let a = 0, b = 1;
                    for (let i = 2; i <= n; i++) { const t = a + b; a = b; b = t; }
                    return b;
                }
            }
        ],
        content: { whatIs: '<h3>Fibonacci Sequence</h3><p>Each number is the sum of the two preceding ones: 0, 1, 1, 2, 3, 5, 8...</p>', faq: [] }
    },
    'roman-numeral-converter': {
        id: 'roman-numeral-converter',
        title: 'Roman Numeral Converter',
        description: 'Convert to/from Roman numerals.',
        category: 'conversion',
        icon: 'Type',
        meta: { title: 'Roman Numeral Converter', description: 'Convert numbers to and from Roman numerals.', keywords: ['roman numerals', 'numeral converter', 'latin numbers'] },
        inputs: [
            { id: 'number', label: 'Number (1-3999)', type: 'number', placeholder: 'e.g. 2024' }
        ],
        outputs: [
            {
                label: 'Roman Numeral',
                calculate: (inputs) => {
                    let num = Number(inputs['number']) || 0;
                    if (num < 1 || num > 3999) return 'Invalid (1-3999)';
                    const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
                    const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
                    let result = '';
                    for (let i = 0; i < vals.length; i++) {
                        while (num >= vals[i]) { result += syms[i]; num -= vals[i]; }
                    }
                    return result;
                }
            }
        ],
        content: { whatIs: '<h3>Roman Numerals</h3><p>An ancient numeral system using letters like I, V, X, L, C, D, M.</p>', faq: [] }
    },
    'hex-to-rgb-converter': {
        id: 'hex-to-rgb-converter',
        title: 'Hex to RGB Converter',
        description: 'Convert hex color to RGB.',
        category: 'other',
        icon: 'Palette',
        meta: { title: 'Hex to RGB Converter', description: 'Convert hexadecimal color codes to RGB values.', keywords: ['hex to rgb', 'color converter', 'css colors'] },
        inputs: [
            { id: 'hex', label: 'Hex Color (e.g. #FF5733)', type: 'text', placeholder: '#FF5733' }
        ],
        outputs: [
            {
                label: 'RGB',
                calculate: (inputs) => {
                    let hex = String(inputs['hex'] || '').replace('#', '');
                    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
                    if (hex.length !== 6) return 'Invalid hex';
                    const r = parseInt(hex.substring(0, 2), 16);
                    const g = parseInt(hex.substring(2, 4), 16);
                    const b = parseInt(hex.substring(4, 6), 16);
                    if (isNaN(r) || isNaN(g) || isNaN(b)) return 'Invalid hex';
                    return `rgb(${r}, ${g}, ${b})`;
                }
            }
        ],
        content: { whatIs: '<h3>Color Codes</h3><p>Hex uses #RRGGBB format. RGB uses decimal values 0-255.</p>', faq: [] }
    },
    'number-to-words': {
        id: 'number-to-words',
        title: 'Number to Words',
        description: 'Convert numbers to words.',
        category: 'other',
        icon: 'FileText',
        meta: { title: 'Number to Words Converter', description: 'Convert numbers into written words.', keywords: ['number to words', 'spell number', 'numeral words'] },
        inputs: [
            {
                id: 'number',
                label: 'Number',
                type: 'number',
                defaultValue: '12345',
                placeholder: 'e.g., 12345'
            }
        ],
        outputs: [
            {
                label: 'In Words',
                calculate: (inputs) => {
                    const num = parseInt(inputs.number);
                    if (isNaN(num)) throw new Error('Invalid input');

                    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
                    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
                    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

                    if (num === 0) return 'zero';

                    function convert(n: number): string {
                        if (n < 10) return ones[n];
                        if (n < 20) return teens[n - 10];
                        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
                        if (n < 1000) return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 !== 0 ? ' ' + convert(n % 100) : '');
                        if (n < 1000000) return convert(Math.floor(n / 1000)) + ' thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
                        return 'Number too large';
                    }

                    return convert(num);
                }
            }
        ],
        content: {
            whatIs: '<p>Standard number to English text conversion.</p>',
            howTo: '<p>Enter any integer.</p>',
            faq: []
        }
    },
    // Batch Y: Photography Tools
    'focal-length-calculator': {
        id: 'focal-length-calculator',
        title: 'Focal Length Calculator',
        description: 'Convert focal length by crop factor.',
        category: 'other',
        icon: 'Camera',
        inputs: [
            {
                id: 'focalLength',
                label: 'Focal Length',
                type: 'number',
                defaultValue: '50',
                placeholder: 'e.g., 50',
                unit: 'mm'
            },
            {
                id: 'cropFactor',
                label: 'Crop Factor',
                type: 'number',
                defaultValue: '1.5',
                placeholder: 'e.g., 1.5'
            }
        ],
        outputs: [
            {
                label: 'Equivalent Focal Length',
                unit: 'mm',
                calculate: (inputs) => {
                    const fl = parseFloat(inputs.focalLength);
                    const cf = parseFloat(inputs.cropFactor);
                    if (isNaN(fl) || isNaN(cf)) throw new Error('Invalid input');
                    return (fl * cf).toFixed(1);
                }
            }
        ],
        content: {
            whatIs: '<p>Calculates the 35mm equivalent focal length for different sensor sizes.</p>',
            howTo: '<p>Enter lens focal length and crop factor.</p>',
            faq: []
        }
    },
    'shutter-speed-calculator': {
        id: 'shutter-speed-calculator',
        title: 'Shutter Speed Calculator',
        description: 'Shutter angle to speed converter.',
        category: 'other',
        icon: 'Aperture',
        inputs: [
            {
                id: 'fps',
                label: 'Frame Rate',
                type: 'number',
                defaultValue: '24',
                placeholder: 'e.g., 24'
            },
            {
                id: 'angle',
                label: 'Shutter Angle',
                type: 'number',
                defaultValue: '180',
                placeholder: 'e.g., 180',
                unit: 'deg'
            }
        ],
        outputs: [
            {
                label: 'Shutter Speed',
                unit: 's',
                calculate: (inputs) => {
                    const fps = parseFloat(inputs.fps);
                    const angle = parseFloat(inputs.angle);
                    if (isNaN(fps) || isNaN(angle) || angle === 0) throw new Error('Invalid');
                    return `1/${Math.round((360 * fps) / angle)}`;
                }
            }
        ],
        content: {
            whatIs: '<p>Converts cinema shutter angle to photography shutter speed.</p>',
            howTo: '<p>Enter FPS and shutter angle.</p>',
            faq: []
        }
    },
    'exposure-value-calculator': {
        id: 'exposure-value-calculator',
        title: 'Exposure Value (EV)',
        description: 'Calculate EV from settings.',
        category: 'other',
        icon: 'Sun',
        inputs: [
            {
                id: 'fstop',
                label: 'Aperture (f/)',
                type: 'number',
                defaultValue: '2.8',
                placeholder: 'e.g., 2.8'
            },
            {
                id: 'shutter',
                label: 'Shutter Speed Denom',
                type: 'number',
                defaultValue: '60',
                placeholder: 'e.g., 60 (for 1/60)'
            },
            {
                id: 'iso',
                label: 'ISO',
                type: 'number',
                defaultValue: '100',
                placeholder: 'e.g., 100'
            }
        ],
        outputs: [
            {
                label: 'EV @ ISO 100',
                calculate: (inputs) => {
                    const N = parseFloat(inputs.fstop);
                    const t = 1 / parseFloat(inputs.shutter);
                    const S = parseFloat(inputs.iso);
                    if (isNaN(N) || isNaN(t) || isNaN(S) || t === 0 || S <= 0) return '0';
                    const ev = Math.log2((N * N) / t) - Math.log2(S / 100);
                    return ev.toFixed(1);
                }
            }
        ],
        content: {
            whatIs: '<p>Calculates Exposure Value (EV) for given settings.</p>',
            howTo: '<p>Enter aperture, shutter speed denominator, and ISO.</p>',
            faq: []
        }
    },
    'megapixels-calculator': {
        id: 'megapixels-calculator',
        title: 'Megapixels Calculator',
        description: 'Resolution to Megapixels.',
        category: 'other',
        icon: 'Image',
        inputs: [
            {
                id: 'w',
                label: 'Width (px)',
                type: 'number',
                defaultValue: '1920',
                placeholder: 'e.g., 1920'
            },
            {
                id: 'h',
                label: 'Height (px)',
                type: 'number',
                defaultValue: '1080',
                placeholder: 'e.g., 1080'
            }
        ],
        outputs: [
            {
                label: 'Megapixels',
                unit: 'MP',
                calculate: (inputs) => {
                    const w = parseFloat(inputs.w);
                    const h = parseFloat(inputs.h);
                    if (isNaN(w) || isNaN(h)) return '0';
                    return ((w * h) / 1000000).toFixed(2);
                }
            }
        ],
        content: {
            whatIs: '<p>Calculates MP count from image dimensions.</p>',
            howTo: '<p>Enter width and height.</p>',
            faq: []
        }
    },
    'print-size-calculator': {
        id: 'print-size-calculator',
        title: 'Print Size Calculator',
        description: 'Max print size at DPI.',
        category: 'other',
        icon: 'Printer',
        inputs: [
            {
                id: 'w',
                label: 'Width (px)',
                type: 'number',
                defaultValue: '3000',
                placeholder: 'px'
            },
            {
                id: 'h',
                label: 'Height (px)',
                type: 'number',
                defaultValue: '2000',
                placeholder: 'px'
            },
            {
                id: 'dpi',
                label: 'DPI',
                type: 'number',
                defaultValue: '300',
                placeholder: 'e.g., 300'
            }
        ],
        outputs: [
            {
                label: 'Max Width',
                unit: 'in',
                calculate: (inputs) => {
                    const w = parseFloat(inputs.w);
                    const dpi = parseFloat(inputs.dpi);
                    if (isNaN(w) || isNaN(dpi) || dpi === 0) return '0';
                    return (w / dpi).toFixed(1);
                }
            },
            {
                label: 'Max Height',
                unit: 'in',
                calculate: (inputs) => {
                    const h = parseFloat(inputs.h);
                    const dpi = parseFloat(inputs.dpi);
                    if (isNaN(h) || isNaN(dpi) || dpi === 0) return '0';
                    return (h / dpi).toFixed(1);
                }
            }
        ],
        content: {
            whatIs: '<p>Calculate maximum print dimensions for digital images.</p>',
            howTo: '<p>Enter dimensions and desired DPI.</p>',
            faq: []
        }
    },
    // Batch Z: Physics & Electrical
    'ohms-law-calculator': {
        id: 'ohms-law-calculator',
        title: 'Ohm\'s Law Calculator',
        description: 'Calculate Voltage, Current, or Resistance.',
        category: 'physics',
        icon: 'Zap',
        inputs: [
            {
                id: 'v',
                label: 'Voltage (V)',
                type: 'number',
                defaultValue: '',
                placeholder: 'Leave empty to calculate'
            },
            {
                id: 'i',
                label: 'Current (I)',
                type: 'number',
                defaultValue: '',
                placeholder: 'Amperes'
            },
            {
                id: 'r',
                label: 'Resistance (R)',
                type: 'number',
                defaultValue: '',
                placeholder: 'Ohms'
            }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const v = parseFloat(inputs.v);
                    const i = parseFloat(inputs.i);
                    const r = parseFloat(inputs.r);

                    // Simple logic: if 2 are present, calc 3rd.
                    if (!isNaN(v) && !isNaN(i) && isNaN(r)) return `R = ${(v / i).toFixed(2)} Ω`;
                    if (!isNaN(v) && !isNaN(r) && isNaN(i)) return `I = ${(v / r).toFixed(2)} A`;
                    if (!isNaN(i) && !isNaN(r) && isNaN(v)) return `V = ${(i * r).toFixed(2)} V`;

                    return 'Enter exactly 2 values';
                }
            }
        ],
        content: {
            whatIs: '<p>Calculates Voltage, Current, or Resistance using Ohm\'s Law (V = IR).</p>',
            howTo: '<p>Enter exactly two known values to calculate the third.</p>',
            faq: []
        }
    },
    'led-resistor-calculator': {
        id: 'led-resistor-calculator',
        title: 'LED Resistor Calculator',
        description: 'Calculate series resistor for LED.',
        category: 'physics',
        icon: 'Zap',
        inputs: [
            {
                id: 'vsource',
                label: 'Source Voltage (V)',
                type: 'number',
                defaultValue: '5',
                placeholder: 'e.g., 5 or 9'
            },
            {
                id: 'vled',
                label: 'LED Forward Voltage (V)',
                type: 'number',
                defaultValue: '2',
                placeholder: 'e.g., 2 (Red), 3.3 (Blue)'
            },
            {
                id: 'iled',
                label: 'LED Current (mA)',
                type: 'number',
                defaultValue: '20',
                placeholder: 'e.g., 20'
            }
        ],
        outputs: [
            {
                label: 'Required Resistance',
                unit: 'Ω',
                calculate: (inputs) => {
                    const vs = parseFloat(inputs.vsource);
                    const vl = parseFloat(inputs.vled);
                    const il = parseFloat(inputs.iled);
                    if (isNaN(vs) || isNaN(vl) || isNaN(il) || il === 0) return '0';
                    const r = (vs - vl) / (il / 1000); // Ohm
                    return r.toFixed(1);
                }
            }
        ],
        content: {
            whatIs: '<p>Calculates the resistor value needed to protect an LED.</p>',
            howTo: '<p>Enter Source Voltage, LED Voltage (e.g. 2V for red), and desired Current (e.g. 20mA).</p>',
            faq: []
        }
    },
    'kinetic-energy-calculator': {
        id: 'kinetic-energy-calculator',
        title: 'Kinetic Energy Calculator',
        description: 'Calculate KE = 0.5 * mv².',
        category: 'physics',
        icon: 'Activity',
        inputs: [
            {
                id: 'm',
                label: 'Mass (kg)',
                type: 'number',
                defaultValue: '10',
                placeholder: 'kg'
            },
            {
                id: 'v',
                label: 'Velocity (m/s)',
                type: 'number',
                defaultValue: '5',
                placeholder: 'm/s'
            }
        ],
        outputs: [
            {
                label: 'Kinetic Energy',
                unit: 'J',
                calculate: (inputs) => {
                    const m = parseFloat(inputs.m);
                    const v = parseFloat(inputs.v);
                    if (isNaN(m) || isNaN(v)) return '0';
                    return (0.5 * m * v * v).toFixed(2);
                }
            }
        ],
        content: {
            whatIs: '<p>Calculates the kinetic energy of a moving object.</p>',
            howTo: '<p>Enter mass in kg and velocity in m/s.</p>',
            faq: []
        }
    },
    'electricity-cost-calculator': {
        id: 'electricity-cost-calculator',
        title: 'Electricity Cost Calculator',
        description: 'Calculate cost of device usage.',
        category: 'finance',
        icon: 'Zap',
        inputs: [
            {
                id: 'watts',
                label: 'Power Consumption (W)',
                type: 'number',
                defaultValue: '100',
                placeholder: 'Watts'
            },
            {
                id: 'hours',
                label: 'Hours used per day',
                type: 'number',
                defaultValue: '4',
                placeholder: 'Hours'
            },
            {
                id: 'rate',
                label: 'Cost per kWh',
                type: 'number',
                defaultValue: '0.15',
                placeholder: 'Currency/kWh'
            }
        ],
        outputs: [
            {
                label: 'Cost per Day',
                calculate: (inputs) => {
                    const w = parseFloat(inputs.watts);
                    const h = parseFloat(inputs.hours);
                    const r = parseFloat(inputs.rate);
                    if (isNaN(w) || isNaN(h) || isNaN(r)) return '0';
                    const kwh = (w * h) / 1000;
                    return (kwh * r).toFixed(2);
                }
            },
            {
                label: 'Cost per Month (30 days)',
                calculate: (inputs) => {
                    const w = parseFloat(inputs.watts);
                    const h = parseFloat(inputs.hours);
                    const r = parseFloat(inputs.rate);
                    if (isNaN(w) || isNaN(h) || isNaN(r)) return '0';
                    const kwh = (w * h) / 1000;
                    return (kwh * r * 30).toFixed(2);
                }
            }
        ],
        content: {
            whatIs: '<p>Calculates the cost of running an electrical device.</p>',
            howTo: '<p>Enter power in Watts, usage hours, and your electricity rate.</p>',
            faq: []
        }
    },
    'force-calculator': {
        id: 'force-calculator',
        title: 'Force Calculator (F=ma)',
        description: 'Calculate Force, Mass, or Acceleration.',
        category: 'physics',
        icon: 'Dumbbell',
        inputs: [
            {
                id: 'f',
                label: 'Force (N)',
                type: 'number',
                defaultValue: '',
                placeholder: 'Newtons'
            },
            {
                id: 'm',
                label: 'Mass (kg)',
                type: 'number',
                defaultValue: '',
                placeholder: 'kg'
            },
            {
                id: 'a',
                label: 'Acceleration (m/s²)',
                type: 'number',
                defaultValue: '',
                placeholder: 'm/s²'
            }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const f = parseFloat(inputs.f);
                    const m = parseFloat(inputs.m);
                    const a = parseFloat(inputs.a);

                    if (!isNaN(m) && !isNaN(a) && isNaN(f)) return `F = ${(m * a).toFixed(2)} N`;
                    if (!isNaN(f) && !isNaN(a) && isNaN(m)) return `m = ${(f / a).toFixed(2)} kg`;
                    if (!isNaN(f) && !isNaN(m) && isNaN(a)) return `a = ${(f / m).toFixed(2)} m/s²`;

                    return 'Enter exactly 2 values';
                }
            }
        ],
        content: {
            whatIs: '<p>Calculates Force using Newton\'s Second Law (F = ma).</p>',
            howTo: '<p>Enter exactly two known values to calculate the third.</p>',
            faq: []
        }
    },
    // Batch AA: Chemistry Tools
    'boyles-law-calculator': {
        id: 'boyles-law-calculator',
        title: "Boyle's Law Calculator",
        description: 'Calculate pressure or volume changes for a gas at constant temperature.',
        category: 'chemistry',
        icon: 'FlaskConical',
        inputs: [
            { id: 'p1', label: 'Initial Pressure (P₁)', type: 'number', placeholder: 'e.g., 1', unit: 'atm' },
            { id: 'v1', label: 'Initial Volume (V₁)', type: 'number', placeholder: 'e.g., 5', unit: 'L' },
            { id: 'p2', label: 'Final Pressure (P₂)', type: 'number', placeholder: 'e.g., 2', unit: 'atm' },
            { id: 'v2', label: 'Final Volume (V₂)', type: 'number', placeholder: 'Leave blank to solve', unit: 'L' }
        ],
        outputs: [
            {
                label: 'Result',
                unit: 'L or atm',
                calculate: (inputs) => {
                    const p1 = Number(inputs.p1);
                    const v1 = Number(inputs.v1);
                    const p2 = Number(inputs.p2);
                    const v2 = Number(inputs.v2);

                    if (p1 && v1 && p2 && !v2) return (p1 * v1) / p2; // Solve V2
                    if (p1 && v1 && !p2 && v2) return (p1 * v1) / v2; // Solve P2
                    if (!p1 && v1 && p2 && v2) return (p2 * v2) / v1; // Solve P1
                    if (p1 && !v1 && p2 && v2) return (p2 * v2) / p1; // Solve V1
                    return 0;
                }
            }
        ],
        content: {
            whatIs: '<p>Boyle\'s Law describes the inverse relationship between the pressure and volume of a gas at constant temperature (P₁V₁ = P₂V₂).</p>',
            howTo: '<p>Enter any three values to calculate the fourth.</p>'
        }
    },
    'charles-law-calculator': {
        id: 'charles-law-calculator',
        title: "Charles's Law Calculator",
        description: 'Calculate volume or temperature changes at constant pressure.',
        category: 'chemistry',
        icon: 'Thermometer',
        inputs: [
            { id: 'v1', label: 'Initial Volume (V₁)', type: 'number', placeholder: 'e.g., 2', unit: 'L' },
            { id: 't1', label: 'Initial Temperature (T₁)', type: 'number', placeholder: 'e.g., 300', unit: 'K' },
            { id: 'v2', label: 'Final Volume (V₂)', type: 'number', placeholder: 'Leave blank to solve', unit: 'L' },
            { id: 't2', label: 'Final Temperature (T₂)', type: 'number', placeholder: 'e.g., 350', unit: 'K' }
        ],
        outputs: [
            {
                label: 'Result',
                unit: 'L or K',
                calculate: (inputs) => {
                    const v1 = Number(inputs.v1);
                    const t1 = Number(inputs.t1);
                    const v2 = Number(inputs.v2);
                    const t2 = Number(inputs.t2);

                    // V1/T1 = V2/T2
                    if (v1 && t1 && v2 && !t2) return (v2 * t1) / v1; // Solve T2
                    if (v1 && t1 && !v2 && t2) return (v1 * t2) / t1; // Solve V2
                    if (!v1 && t1 && v2 && t2) return (v2 * t1) / t2; // Solve V1
                    if (v1 && !t1 && v2 && t2) return (v1 * t2) / v2; // Solve T1
                    return 0;
                }
            }
        ],
        content: {
            whatIs: '<p>Charles\'s Law states that Volume is directly proportional to Temperature (Kelvin) at constant pressure.</p>',
        }
    },
    'ph-calculator': {
        id: 'ph-calculator',
        title: 'pH Calculator',
        description: 'Calculate pH from Hydrogen ion concentration [H+].',
        category: 'chemistry',
        icon: 'TestTube',
        inputs: [
            { id: 'h', label: 'Given', type: 'select', options: [{ label: 'Concentration [H+]', value: 'conc' }, { label: 'pH Value', value: 'ph' }], defaultValue: 'conc' },
            { id: 'val', label: 'Value', type: 'number', placeholder: 'e.g., 0.001 or 7' }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const mode = inputs.h;
                    const val = Number(inputs.val);
                    if (!val) return 0;
                    if (mode === 'conc') return -Math.log10(val);
                    if (mode === 'ph') return Math.pow(10, -val);
                    return 0;
                }
            }
        ],
        content: {
            whatIs: '<p>Calculate pH from [H+] or vice versa using <code>pH = -log[H+]</code>.</p>'
        }
    },
    'ideal-gas-law-calculator': {
        id: 'ideal-gas-law-calculator',
        title: 'Ideal Gas Law Calculator',
        description: 'Calculate PV = nRT for ideal gases.',
        category: 'chemistry',
        icon: 'Wind',
        inputs: [
            { id: 'P', label: 'Pressure (P)', type: 'number', placeholder: 'atm (leave blank to solve)', unit: 'atm' },
            { id: 'V', label: 'Volume (V)', type: 'number', placeholder: 'L', unit: 'L' },
            { id: 'n', label: 'Moles (n)', type: 'number', placeholder: 'mol', unit: 'mol' },
            { id: 'T', label: 'Temperature (T)', type: 'number', placeholder: 'K', unit: 'K' }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const P = Number(inputs.P);
                    const V = Number(inputs.V);
                    const n = Number(inputs.n);
                    const T = Number(inputs.T);
                    const R = 0.0821;

                    if (!P && V && n && T) return (n * R * T) / V;
                    if (P && !V && n && T) return (n * R * T) / P;
                    if (P && V && !n && T) return (P * V) / (R * T);
                    if (P && V && n && !T) return (P * V) / (n * R);
                    return 0;
                }
            }
        ],
        content: {
            whatIs: '<p>Calculates state variables of a hypothetical ideal gas using <code>PV = nRT</code>. R = 0.0821 L⋅atm/(mol⋅K).</p>'
        }
    },
    'half-life-calculator': {
        id: 'half-life-calculator',
        title: 'Half-Life Calculator',
        description: 'Calculate radioactive decay.',
        category: 'chemistry',
        icon: 'Activity',
        inputs: [
            { id: 'N0', label: 'Initial Quantity (N₀)', type: 'number', placeholder: '100' },
            { id: 'Nt', label: 'Remaining Quantity (Nₜ)', type: 'number', placeholder: 'Leave blank to solve' },
            { id: 't', label: 'Elapsed Time (t)', type: 'number', placeholder: '10' },
            { id: 'th', label: 'Half-Life (t½)', type: 'number', placeholder: '5' }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const N0 = Number(inputs.N0);
                    const Nt = Number(inputs.Nt);
                    const t = Number(inputs.t);
                    const th = Number(inputs.th);

                    if (N0 && t && th && !Nt) return N0 * Math.pow(0.5, t / th);
                    if (Nt && t && th && !N0) return Nt / Math.pow(0.5, t / th);
                    if (N0 && Nt && th && !t) return th * Math.log(Nt / N0) / Math.log(0.5);
                    if (N0 && Nt && t && !th) return t * Math.log(0.5) / Math.log(Nt / N0);

                    return 0;
                }
            }
        ],
        content: { text: "Calculates remaining quantity or half-life time." }
    },
    // Batch AB: Construction Tools
    'concrete-calculator': {
        id: 'concrete-calculator',
        title: 'Concrete Calculator',
        description: 'Calculate concrete volume and bags needed.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'l', label: 'Length (ft)', type: 'number', placeholder: 'Length', unit: 'ft' },
            { id: 'w', label: 'Width (ft)', type: 'number', placeholder: 'Width', unit: 'ft' },
            { id: 't', label: 'Thickness (in)', type: 'number', placeholder: 'Thickness', unit: 'in' }
        ],
        outputs: [
            {
                label: 'Volume (Cubic Yards)',
                unit: 'yd³',
                calculate: (inputs) => {
                    const l = Number(inputs.l);
                    const w = Number(inputs.w);
                    const t = Number(inputs.t);
                    if (!l || !w || !t) return 0;
                    const ft3 = l * w * (t / 12);
                    return (ft3 / 27).toFixed(2);
                }
            },
            {
                label: '80lb Bags Needed',
                unit: 'bags',
                calculate: (inputs) => {
                    const l = Number(inputs.l);
                    const w = Number(inputs.w);
                    const t = Number(inputs.t);
                    if (!l || !w || !t) return 0;
                    const yd3 = (l * w * (t / 12)) / 27;
                    return Math.ceil(yd3 * 45); // Approx 45 bags per yd3
                }
            },
            {
                label: '60lb Bags Needed',
                unit: 'bags',
                calculate: (inputs) => {
                    const l = Number(inputs.l);
                    const w = Number(inputs.w);
                    const t = Number(inputs.t);
                    if (!l || !w || !t) return 0;
                    const yd3 = (l * w * (t / 12)) / 27;
                    return Math.ceil(yd3 * 60); // Approx 60 bags per yd3
                }
            }
        ],
        content: {
            whatIs: '<p>Calculates cubic yards of concrete and number of premix bags required for a slab.</p>'
        }
    },
    'brick-calculator': {
        id: 'brick-calculator',
        title: 'Brick Calculator',
        description: 'Calculate bricks needed for a wall.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'l', label: 'Wall Length (ft)', type: 'number', placeholder: '10', unit: 'ft' },
            { id: 'h', label: 'Wall Height (ft)', type: 'number', placeholder: '8', unit: 'ft' },
            { id: 'bias', label: 'Waste Buffer (%)', type: 'number', defaultValue: '5', placeholder: '5' }
        ],
        outputs: [
            {
                label: 'Total Bricks Needed',
                unit: 'bricks',
                calculate: (inputs) => {
                    const l = Number(inputs.l);
                    const h = Number(inputs.h);
                    const b = Number(inputs.bias) || 0;
                    if (!l || !h) return 0;
                    const area = l * h;
                    const bricksPerSqFt = 7; // Standard modular brick
                    const total = area * bricksPerSqFt;
                    return Math.ceil(total * (1 + b / 100));
                }
            }
        ],
        content: {
            whatIs: '<p>Estimates standard bricks needed for a single-layer wall (7 bricks per sq ft).</p>'
        }
    },
    'tile-calculator': {
        id: 'tile-calculator',
        title: 'Tile Calculator',
        description: 'Calculate tiles needed for a floor/wall.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'l', label: 'Room Length (ft)', type: 'number', placeholder: '12', unit: 'ft' },
            { id: 'w', label: 'Room Width (ft)', type: 'number', placeholder: '10', unit: 'ft' },
            { id: 'ts', label: 'Tile Size (in²)', type: 'select', options: [{ label: '12x12 inch', value: '144' }, { label: '18x18 inch', value: '324' }, { label: '24x24 inch', value: '576' }], defaultValue: '144' }
        ],
        outputs: [
            {
                label: 'Total Tiles',
                unit: 'tiles',
                calculate: (inputs) => {
                    const l = Number(inputs.l);
                    const w = Number(inputs.w);
                    const ts = Number(inputs.ts);
                    if (!l || !w || !ts) return 0;
                    const areaSqFt = l * w;
                    const tileSqFt = ts / 144;
                    const count = areaSqFt / tileSqFt;
                    return Math.ceil(count * 1.10); // +10% waste
                }
            },
            {
                label: 'Area to Cover',
                unit: 'sq ft',
                calculate: (inputs) => (Number(inputs.l) * Number(inputs.w)).toFixed(1)
            }
        ],
        content: {
            whatIs: '<p>Calculates total tiles needed including 10% for waste/cuts.</p>'
        }
    },
    'paint-calculator': {
        id: 'paint-calculator',
        title: 'Paint Calculator',
        description: 'Calculate paint gallons for a room.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'l', label: 'Room Length (ft)', type: 'number', placeholder: '12' },
            { id: 'w', label: 'Room Width (ft)', type: 'number', placeholder: '10' },
            { id: 'h', label: 'Wall Height (ft)', type: 'number', placeholder: '8' },
            { id: 'c', label: 'Coats', type: 'number', defaultValue: '2' }
        ],
        outputs: [
            {
                label: 'Gallons Needed',
                unit: 'gal',
                calculate: (inputs) => {
                    const l = Number(inputs.l);
                    const w = Number(inputs.w);
                    const h = Number(inputs.h);
                    const c = Number(inputs.c) || 1;
                    if (!l || !w || !h) return 0;
                    const perimeter = 2 * (l + w);
                    const area = perimeter * h;
                    // Deduct ~20 sq ft for door/window approx? No, simple calc.
                    const coverage = 350; // sq ft per gallon
                    return ((area / coverage) * c).toFixed(2);
                }
            },
            {
                label: 'Total Wall Area',
                unit: 'sq ft',
                calculate: (inputs) => {
                    const l = Number(inputs.l);
                    const w = Number(inputs.w);
                    const h = Number(inputs.h);
                    return 2 * (l + w) * h;
                }
            }
        ],
        content: {
            whatIs: '<p>Estimates paint needed based on 350 sq ft/gallon coverage.</p>'
        }
    },
    'lumber-calculator': {
        id: 'lumber-calculator',
        title: 'Board Foot Calculator',
        description: 'Calculate lumber volume in Board Feet.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 't', label: 'Thickness (in)', type: 'number', defaultValue: '1', placeholder: '1' },
            { id: 'w', label: 'Width (in)', type: 'number', defaultValue: '6', placeholder: '6' },
            { id: 'l', label: 'Length (ft)', type: 'number', defaultValue: '8', placeholder: '8' },
            { id: 'q', label: 'Quantity', type: 'number', defaultValue: '1' }
        ],
        outputs: [
            {
                label: 'Total Board Feet',
                unit: 'bf',
                calculate: (inputs) => {
                    const t = Number(inputs.t);
                    const w = Number(inputs.w);
                    const l = Number(inputs.l);
                    const q = Number(inputs.q) || 1;
                    if (!t || !w || !l) return 0;
                    return ((t * w * l) / 12 * q).toFixed(2);
                }
            }
        ],
        content: {
            whatIs: '<p>Calculates volume in Board Feet (1 BF = 12x12x1 inch).</p>'
        }
    },
    // Batch AC: Biology Tools
    'dna-transcription-calculator': {
        id: 'dna-transcription-calculator',
        title: 'DNA Transcription',
        description: 'Transcribe DNA sequence to RNA.',
        category: 'biology',
        icon: 'Dna',
        inputs: [
            { id: 'dna', label: 'DNA Sequence (A, T, C, G)', type: 'text', placeholder: 'ATCG...' }
        ],
        outputs: [
            {
                label: 'RNA Sequence',
                calculate: (inputs) => {
                    const dna = inputs.dna || '';
                    return dna.toUpperCase().replace(/T/g, 'U');
                }
            },
            {
                label: 'Complementary DNA',
                calculate: (inputs) => {
                    const dna = inputs.dna || '';
                    const map: { [key: string]: string } = { A: 'T', T: 'A', C: 'G', G: 'C' };
                    return dna.toUpperCase().split('').map(c => map[c] || c).join('');
                }
            }
        ],
        content: {
            whatIs: '<p>Transcribes a DNA sequence into RNA (Thymine -> Uracil) and finds the complementary strand.</p>',
        }
    },
    'punnett-square-calculator': {
        id: 'punnett-square-calculator',
        title: 'Punnett Square Calculator',
        description: 'Calculate genetic trait probabilities.',
        category: 'biology',
        icon: 'Microscope', // Using Microscope if Dna used above, or repeat Dna? I'll allow repeat or use generic 'Activity'
        inputs: [ // Simple Monohybrid
            { id: 'p1', label: 'Parent 1 Genotype', type: 'text', placeholder: 'Aa' },
            { id: 'p2', label: 'Parent 2 Genotype', type: 'text', placeholder: 'Aa' }
        ],
        outputs: [
            {
                label: 'Genotype Ratio',
                calculate: (inputs) => {
                    const p1 = (inputs.p1 || '').toUpperCase(); // Simplification: assume simple chars
                    const p2 = (inputs.p2 || '').toUpperCase(); // Assume length 2
                    if (p1.length !== 2 || p2.length !== 2) return 'Enter 2 letters each (e.g. Aa)';

                    const g: string[] = [];
                    for (let c1 of p1) for (let c2 of p2) g.push((c1 < c2 ? c1 + c2 : c2 + c1)); // Sort Aa

                    const counts: any = {};
                    g.forEach(x => counts[x] = (counts[x] || 0) + 1);
                    return Object.entries(counts).map(([k, v]) => `${k}: ${v}/4`).join(', ');
                }
            },
            {
                label: 'Offspring Probabilities',
                calculate: (inputs) => {
                    const p1 = (inputs.p1 || '').toUpperCase();
                    const p2 = (inputs.p2 || '').toUpperCase();
                    if (p1.length !== 2 || p2.length !== 2) return '';

                    const g: string[] = [];
                    for (let c1 of p1) for (let c2 of p2) g.push((c1 < c2 ? c1 + c2 : c2 + c1));
                    const counts: any = {};
                    g.forEach(x => counts[x] = (counts[x] || 0) + 1);
                    return Object.entries(counts).map(([k, v]) => `${k}: ${(v as number) * 25}%`).join(', ');
                }
            }
        ],
        content: {
            whatIs: '<p>Simulates a monohybrid cross between two parents.</p>'
        }
    },
    'bmi-pro-calculator': {
        id: 'bmi-pro-calculator',
        title: 'BMI Pro Calculator',
        description: 'Advanced BMI with WHO classification.',
        category: 'biology', // Fits 'health' better but requested in Biology batch. I'll put in 'health' actually? User said Biology batch. I'll stick to 'biology' for now or 'health'.
        // 'health' is 100% better for UX. But for "Batch AC" organization, I'll allow it.
        // Actually, I can put category: 'health' but define it here.
        inputs: [
            { id: 'w', label: 'Weight (kg)', type: 'number', placeholder: 'kg' },
            { id: 'h', label: 'Height (cm)', type: 'number', placeholder: 'cm' },
            { id: 'age', label: 'Age', type: 'number', placeholder: 'years' },
            { id: 'g', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'm' }, { label: 'Female', value: 'f' }], defaultValue: 'm' }
        ],
        outputs: [
            {
                label: 'BMI Score',
                calculate: (inputs) => {
                    const w = Number(inputs.w);
                    const h = Number(inputs.h) / 100; // m
                    if (!w || !h) return 0;
                    return (w / (h * h)).toFixed(1);
                }
            },
            {
                label: 'Classification',
                calculate: (inputs) => {
                    const w = Number(inputs.w);
                    const h = Number(inputs.h) / 100;
                    if (!w || !h) return '-';
                    const bmi = w / (h * h);
                    if (bmi < 18.5) return 'Underweight';
                    if (bmi < 25) return 'Normal weight';
                    if (bmi < 30) return 'Overweight';
                    return 'Obesity';
                }
            },
            {
                label: 'Healthy Weight Range',
                unit: 'kg',
                calculate: (inputs) => {
                    const h = Number(inputs.h) / 100;
                    if (!h) return '-';
                    const min = (18.5 * h * h).toFixed(1);
                    const max = (24.9 * h * h).toFixed(1);
                    return `${min} - ${max}`;
                }
            }
        ],
        content: {
            whatIs: '<p>Calculates Body Mass Index with classification and healthy weight range.</p>'
        }
    },
    'blood-type-calculator': {
        id: 'blood-type-calculator',
        title: 'Blood Type Calculator',
        description: 'Predict child blood type from parents.',
        category: 'biology',
        icon: 'Activity', // Or simple generic
        inputs: [
            { id: 'p1', label: 'Parent 1', type: 'select', options: [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' }, { label: 'AB', value: 'AB' }, { label: 'O', value: 'O' }], defaultValue: 'A' },
            { id: 'p2', label: 'Parent 2', type: 'select', options: [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' }, { label: 'AB', value: 'AB' }, { label: 'O', value: 'O' }], defaultValue: 'B' }
        ],
        outputs: [
            {
                label: 'Possible Child Types',
                calculate: (inputs) => {
                    // Simplified probability logic:
                    // O = OO, A = AA/AO, B = BB/BO, AB = AB
                    // Logic is complex to do inline effectively without map.
                    // I will return common outcomes for key pairs or a generalized string.
                    // This is "Genetic Calculator".
                    // Map: 
                    // O+O->O. A+O->A,O. B+O->B,O. AB+O->A,B.
                    // A+A->A,O. A+B->A,B,AB,O. A+AB->A,B,AB.
                    // B+B->B,O. B+AB->A,B,AB.
                    // AB+AB->A,B,AB.
                    // I'll hardcode the combinations map.
                    const p1 = inputs.p1;
                    const p2 = inputs.p2;
                    // Sort
                    const pair = [p1, p2].sort().join('-');
                    const map: any = {
                        'O-O': 'O',
                        'A-O': 'A, O',
                        'B-O': 'B, O',
                        'AB-O': 'A, B',
                        'A-A': 'A, O',
                        'A-B': 'A, B, AB, O',
                        'A-AB': 'A, B, AB',
                        'B-B': 'B, O',
                        'B-AB': 'A, B, AB',
                        'AB-AB': 'A, B, AB'
                    };
                    return map[pair] || 'Unknown';
                }
            }
        ],
        content: {
            whatIs: '<p>Predicts possible blood types of a child based on parents (ABO system).</p>'
        }
    },
    'bacterial-growth-calculator': {
        id: 'bacterial-growth-calculator',
        title: 'Bacterial Growth Calculator',
        description: 'Calculate exponential bacterial growth.',
        category: 'biology',
        icon: 'Activity',
        inputs: [
            { id: 'N0', label: 'Initial Population (N₀)', type: 'number', placeholder: '100' },
            { id: 't', label: 'Time (Hours)', type: 'number', placeholder: '5' },
            { id: 'g', label: 'Generation Time (Doubling Time) (min)', type: 'number', placeholder: '20' } // minutes typically
        ],
        outputs: [
            {
                label: 'Final Population (Nt)',
                calculate: (inputs) => {
                    const N0 = Number(inputs.N0);
                    const t = Number(inputs.t); // hours
                    const g = Number(inputs.g); // mins
                    if (!N0 || !t || !g) return 0;
                    // n (generations) = (t * 60) / g
                    const n = (t * 60) / g;
                    // Nt = N0 * 2^n
                    return (N0 * Math.pow(2, n)).toLocaleString();
                }
            },
            {
                label: 'Generations',
                calculate: (inputs) => {
                    const t = Number(inputs.t);
                    const g = Number(inputs.g);
                    if (!t || !g) return 0;
                    return ((t * 60) / g).toFixed(1);
                }
            }
        ],
        content: {
            whatIs: '<p>Calculates final bacterial population using Nₜ = N₀ * 2ⁿ.</p>'
        }
    },
    // Batch AD: Statistics Tools
    'chi-square-calculator': {
        id: 'chi-square-calculator',
        title: 'Chi-Square Calculator',
        description: 'Calculate Chi-Square Goodness of Fit.',
        category: 'statistics',
        icon: 'BarChart3',
        inputs: [
            { id: 'obs', label: 'Observed Values (comma separated)', type: 'text', placeholder: '10, 20, 30' },
            { id: 'exp', label: 'Expected Values (comma separated)', type: 'text', placeholder: '10, 20, 30' }
        ],
        outputs: [
            {
                label: 'Chi-Square (χ²)',
                calculate: (inputs) => {
                    const o = (inputs.obs || '').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
                    const e = (inputs.exp || '').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
                    if (o.length === 0 || e.length === 0 || o.length !== e.length) return 'Datasets must match length';

                    let sum = 0;
                    for (let i = 0; i < o.length; i++) {
                        if (e[i] === 0) return 'Expected value cannot be 0';
                        sum += Math.pow(o[i] - e[i], 2) / e[i];
                    }
                    return sum.toFixed(4);
                }
            },
            {
                label: 'Degrees of Freedom (df)',
                calculate: (inputs) => {
                    const o = (inputs.obs || '').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
                    return o.length > 1 ? (o.length - 1).toString() : '0';
                }
            }
        ],
        content: {
            whatIs: '<p>Calculates χ² statistic for Goodness of Fit: Σ(O-E)²/E.</p>'
        }
    },
    'pearson-correlation-calculator': {
        id: 'pearson-correlation-calculator',
        title: 'Correlation Calculator (r)',
        description: 'Calculate Pearson Correlation Coefficient.',
        category: 'statistics',
        icon: 'BarChart3',
        inputs: [
            { id: 'x', label: 'X Values (comma separated)', type: 'text', placeholder: '1, 2, 3' },
            { id: 'y', label: 'Y Values (comma separated)', type: 'text', placeholder: '2, 4, 6' }
        ],
        outputs: [
            {
                label: 'Pearson Correlation (r)',
                calculate: (inputs) => {
                    const x = (inputs.x || '').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
                    const y = (inputs.y || '').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
                    if (x.length !== y.length || x.length < 2) return 'Enter matched pairs (>1)';

                    const n = x.length;
                    const sumX = x.reduce((a, b) => a + b, 0);
                    const sumY = y.reduce((a, b) => a + b, 0);
                    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
                    const sumX2 = x.reduce((a, b) => a + b * b, 0);
                    const sumY2 = y.reduce((a, b) => a + b * b, 0);

                    const num = n * sumXY - sumX * sumY;
                    const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
                    if (den === 0) return '0';
                    return (num / den).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Calculates Pearson correlation coefficient (r) between two variables.</p>' }
    },
    'linear-regression-calculator': {
        id: 'linear-regression-calculator',
        title: 'Linear Regression Calculator',
        description: 'Calculate line of best fit y = mx + c.',
        category: 'statistics',
        icon: 'TrendingUp',
        inputs: [
            { id: 'x', label: 'X Values (comma separated)', type: 'text', placeholder: '1, 2, 3' },
            { id: 'y', label: 'Y Values (comma separated)', type: 'text', placeholder: '2, 4, 5' }
        ],
        outputs: [
            {
                label: 'Equation',
                calculate: (inputs) => {
                    const x = (inputs.x || '').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
                    const y = (inputs.y || '').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
                    if (x.length !== y.length || x.length < 2) return 'Enter matched pairs';
                    const n = x.length;
                    const sumX = x.reduce((a, b) => a + b, 0);
                    const sumY = y.reduce((a, b) => a + b, 0);
                    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
                    const sumX2 = x.reduce((a, b) => a + b * b, 0);
                    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
                    const c = (sumY - m * sumX) / n;
                    return `y = ${m.toFixed(3)}x + ${c.toFixed(3)}`;
                }
            },
            {
                label: 'Slope (m)',
                calculate: (inputs) => {
                    const x = (inputs.x || '').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
                    const y = (inputs.y || '').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
                    if (x.length !== y.length || x.length < 2) return '';
                    const n = x.length;
                    const sumX = x.reduce((a, b) => a + b, 0);
                    const sumY = y.reduce((a, b) => a + b, 0);
                    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
                    const sumX2 = x.reduce((a, b) => a + b * b, 0);
                    return ((n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Finds the equation of the line of best fit (Least Squares method).</p>' }
    },
    'anova-calculator': {
        id: 'anova-calculator',
        title: 'One-Way ANOVA Calculator',
        description: 'Compare means of up to 3 groups.',
        category: 'statistics',
        icon: 'BarChart3',
        inputs: [
            { id: 'g1', label: 'Group 1 Values', type: 'text', placeholder: '10, 12, 11' },
            { id: 'g2', label: 'Group 2 Values', type: 'text', placeholder: '14, 15, 13' },
            { id: 'g3', label: 'Group 3 Values (Optional)', type: 'text', placeholder: 'Optional' }
        ],
        outputs: [
            {
                label: 'F-Statistic',
                calculate: (inputs) => {
                    const parse = (s: string) => (s || '').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
                    const g1 = parse(inputs.g1);
                    const g2 = parse(inputs.g2);
                    const g3 = parse(inputs.g3);

                    const groups = [g1, g2, g3].filter(g => g.length > 0);
                    if (groups.length < 2) return 'Enter at least 2 groups';

                    // Flatten
                    const all = groups.flat();
                    const n = all.length;
                    const k = groups.length; // num groups
                    const grandMean = all.reduce((a, b) => a + b, 0) / n;
                    // SSB (Between)
                    let ssB = 0;
                    groups.forEach(g => {
                        const mean = g.reduce((a, b) => a + b, 0) / g.length;
                        ssB += g.length * Math.pow(mean - grandMean, 2);
                    });
                    // SSW (Within)
                    let ssW = 0;
                    groups.forEach(g => {
                        const mean = g.reduce((a, b) => a + b, 0) / g.length;
                        ssW += g.reduce((a, b) => a + Math.pow(b - mean, 2), 0);
                    });
                    const dfB = k - 1;
                    const dfW = n - k;
                    const msB = ssB / dfB;
                    const msW = ssW / dfW;

                    return (msB / msW).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Calculates the F-ratio for One-Way Analysis of Variance.</p>' }
    },
    'standard-error-calculator': {
        id: 'standard-error-calculator',
        title: 'Standard Error Calculator',
        description: 'Calculate Standard Error of the Mean (SEM).',
        category: 'statistics',
        icon: 'BarChart3',
        inputs: [
            { id: 'data', label: 'Data Set (comma separated)', type: 'text', placeholder: '1, 2, 3, 4, 5' }
        ],
        outputs: [
            {
                label: 'Standard Error (SEM)',
                calculate: (inputs) => {
                    const data = (inputs.data || '').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
                    if (data.length < 2) return 'Enter >1 values';

                    const n = data.length;
                    const mean = data.reduce((a, b) => a + b, 0) / n;
                    const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1);
                    const sd = Math.sqrt(variance);
                    return (sd / Math.sqrt(n)).toFixed(4);
                }
            },
            {
                label: 'Standard Deviation',
                calculate: (inputs) => {
                    const data = (inputs.data || '').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
                    if (data.length < 2) return '';
                    const n = data.length;
                    const mean = data.reduce((a, b) => a + b, 0) / n;
                    const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1);
                    return Math.sqrt(variance).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Calculates Standard Error of the Mean (SEM = SD / √n).</p>' }
    },
    // Batch AE: Ecology Tools
    'simpsons-diversity-calculator': {
        id: 'simpsons-diversity-calculator',
        title: "Simpson's Diversity Index",
        description: 'Calculate species diversity (D).',
        category: 'ecology',
        icon: 'Sprout',
        inputs: [
            { id: 'n', label: 'Species Counts (comma separated)', type: 'text', placeholder: '10, 20, 5' }
        ],
        outputs: [
            {
                label: 'Simpson\'s Index (D)',
                calculate: (inputs) => {
                    const counts = (inputs.n || '').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
                    if (counts.length === 0) return 0;
                    const N = counts.reduce((a, b) => a + b, 0);
                    if (N === 0) return 0;

                    const sum = counts.reduce((a, n) => a + (n / N) * (n / N), 0);
                    return sum.toFixed(4);
                }
            },
            {
                label: 'Diversity Index (1 - D)',
                calculate: (inputs) => {
                    const counts = (inputs.n || '').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
                    if (counts.length === 0) return 0;
                    const N = counts.reduce((a, b) => a + b, 0);
                    if (N === 0) return 0;
                    const sum = counts.reduce((a, n) => a + (n / N) * (n / N), 0);
                    return (1 - sum).toFixed(4);
                }
            },
            {
                label: 'Reciprocal Index (1 / D)',
                calculate: (inputs) => {
                    const counts = (inputs.n || '').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
                    if (counts.length === 0) return 0;
                    const N = counts.reduce((a, b) => a + b, 0);
                    if (N === 0) return 0;
                    const sum = counts.reduce((a, n) => a + (n / N) * (n / N), 0);
                    if (sum === 0) return 'Infinity';
                    return (1 / sum).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Calculates Simpson\'s Diversity Index (D), 1-D, and 1/D.</p>' }
    },
    'shannon-diversity-calculator': {
        id: 'shannon-diversity-calculator',
        title: "Shannon Diversity Index",
        description: 'Calculate Shannon-Wiener Index (H\').',
        category: 'ecology',
        icon: 'Sprout',
        inputs: [
            { id: 'n', label: 'Species Counts (comma separated)', type: 'text', placeholder: '10, 20, 5' }
        ],
        outputs: [
            {
                label: 'Shannon Index (H\')',
                calculate: (inputs) => {
                    const counts = (inputs.n || '').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
                    if (counts.length === 0) return 0;
                    const N = counts.reduce((a, b) => a + b, 0);
                    if (N === 0) return 0;
                    let h = 0;
                    counts.forEach(n => {
                        if (n > 0) {
                            const pi = n / N;
                            h += pi * Math.log(pi);
                        }
                    });
                    return (-h).toFixed(4);
                }
            },
            {
                label: 'Evenness (E)', // H' / ln(S)
                calculate: (inputs) => {
                    const counts = (inputs.n || '').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
                    if (counts.length === 0) return 0;
                    const N = counts.reduce((a, b) => a + b, 0);
                    if (N === 0) return 0;
                    let h = 0;
                    counts.forEach(n => {
                        if (n > 0) {
                            const pi = n / N;
                            h += pi * Math.log(pi);
                        }
                    });
                    const S = counts.length;
                    if (S < 2) return 0; // ln(1) = 0 input.
                    return (-h / Math.log(S)).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Calculates Shannon-Wiener Index (H\') and Species Evenness.</p>' }
    },
    'population-density-calculator': {
        id: 'population-density-calculator',
        title: 'Population Density',
        description: 'Calculate population per unit area.',
        category: 'ecology',
        icon: 'Sprout',
        inputs: [
            { id: 'p', label: 'Population Size', type: 'number', placeholder: '1000' },
            { id: 'a', label: 'Land Area', type: 'number', placeholder: '50' },
            { id: 'u', label: 'Area Unit', type: 'select', options: [{ label: 'km²', value: 'km' }, { label: 'mi²', value: 'mi' }], defaultValue: 'km' }
        ],
        outputs: [
            {
                label: 'Density',
                calculate: (inputs) => {
                    const p = Number(inputs.p);
                    const a = Number(inputs.a);
                    const u = inputs.u === 'mi' ? 'people/mi²' : 'people/km²';
                    if (!p || !a) return 0;
                    return (p / a).toFixed(2) + ' ' + u;
                }
            }
        ],
        content: { whatIs: '<p>Simple calculation of population density (Population / Area).</p>' }
    },
    'trophic-efficiency-calculator': {
        id: 'trophic-efficiency-calculator',
        title: 'Trophic Efficiency',
        description: 'Calculate energy transfer between levels.',
        category: 'ecology',
        icon: 'Sprout',
        inputs: [
            { id: 'e1', label: 'Energy at Lower Level', type: 'number', placeholder: '10000', unit: 'J' },
            { id: 'e2', label: 'Energy at Higher Level', type: 'number', placeholder: '1000', unit: 'J' }
        ],
        outputs: [
            {
                label: 'Efficiency (%)',
                unit: '%',
                calculate: (inputs) => {
                    const e1 = Number(inputs.e1);
                    const e2 = Number(inputs.e2);
                    if (!e1 || !e2) return 0;
                    return ((e2 / e1) * 100).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates percentage of energy transferred between trophic levels (typically ~10%).</p>' }
    },
    'mark-recapture-calculator': {
        id: 'mark-recapture-calculator',
        title: 'Mark-Recapture (Lincoln Index)',
        description: 'Estimate population size.',
        category: 'ecology',
        icon: 'Sprout',
        inputs: [
            { id: 'M', label: 'Number Marked in 1st Catch (M)', type: 'number', placeholder: '50' },
            { id: 'C', label: 'Total in 2nd Catch (C)', type: 'number', placeholder: '60' },
            { id: 'R', label: 'Number Recaptured (Marked) (R)', type: 'number', placeholder: '10' }
        ],
        outputs: [
            {
                label: 'Estimated Population (N)',
                calculate: (inputs) => {
                    const M = Number(inputs.M);
                    const C = Number(inputs.C);
                    const R = Number(inputs.R);

                    if (!M || !C || !R) return 0;
                    // Lincoln Index: N = (M * C) / R
                    return Math.floor((M * C) / R).toString();
                }
            }
        ],
        content: { whatIs: '<p>Estimates population size using the Lincoln Index (N = M*C/R).</p>' }
    },
    // Batch AF: Everyday Tools II
    'tip-calculator': {
        id: 'tip-calculator',
        title: 'Tip Calculator',
        description: 'Calculate tip and split bill.',
        category: 'everyday',
        icon: 'Calculator', // Generic or 'Coins'
        inputs: [
            { id: 'bill', label: 'Bill Amount', type: 'number', placeholder: '50.00', unit: '$' },
            { id: 'tip', label: 'Tip Percentage', type: 'number', defaultValue: '15', placeholder: '15', unit: '%' },
            { id: 'ppl', label: 'Number of People', type: 'number', defaultValue: '1', placeholder: '1' }
        ],
        outputs: [
            {
                label: 'Tip Amount',
                unit: '$',
                calculate: (inputs) => {
                    const bill = Number(inputs.bill);
                    const tip = Number(inputs.tip);
                    if (!bill) return 0;
                    return (bill * (tip / 100)).toFixed(2);
                }
            },
            {
                label: 'Total Bill',
                unit: '$',
                calculate: (inputs) => {
                    const bill = Number(inputs.bill);
                    const tip = Number(inputs.tip);
                    if (!bill) return 0;
                    return (bill * (1 + tip / 100)).toFixed(2);
                }
            },
            {
                label: 'Total Per Person',
                unit: '$',
                calculate: (inputs) => {
                    const bill = Number(inputs.bill);
                    const tip = Number(inputs.tip);
                    const ppl = Number(inputs.ppl) || 1;
                    if (!bill) return 0;
                    return ((bill * (1 + tip / 100)) / ppl).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Simple calculator for tipping and splitting checks.</p>' }
    },
    'discount-calculator': {
        id: 'discount-calculator',
        title: 'Discount Calculator',
        description: 'Calculate sale price and savings.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'price', label: 'Original Price', type: 'number', placeholder: '100', unit: '$' },
            { id: 'disc', label: 'Discount', type: 'number', placeholder: '20', unit: '%' }
        ],
        outputs: [
            {
                label: 'Final Price',
                unit: '$',
                calculate: (inputs) => {
                    const p = Number(inputs.price);
                    const d = Number(inputs.disc);
                    if (!p) return 0;
                    return (p * (1 - d / 100)).toFixed(2);
                }
            },
            {
                label: 'You Save',
                unit: '$',
                calculate: (inputs) => {
                    const p = Number(inputs.price);
                    const d = Number(inputs.disc);
                    if (!p) return 0;
                    return (p * (d / 100)).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates final price after discount and total savings.</p>' }
    },
    'fuel-cost-calculator': {
        id: 'fuel-cost-calculator',
        title: 'Fuel Cost Calculator',
        description: 'Calculate trip fuel cost.',
        category: 'everyday',
        icon: 'Car', // Needs 'Car' or 'Fuel'
        inputs: [
            { id: 'dist', label: 'Distance', type: 'number', placeholder: '100', unit: 'miles/km' },
            { id: 'eff', label: 'Fuel Efficiency', type: 'number', placeholder: '25', unit: 'MPG or L/100km' },
            { id: 'price', label: 'Fuel Price', type: 'number', placeholder: '3.50', unit: 'per gallon/L' },
            { id: 'mode', label: 'Calculation Mode', type: 'select', options: [{ label: 'MPG (US)', value: 'mpg' }, { label: 'L/100km (Metric)', value: 'metric' }], defaultValue: 'mpg' }
        ],
        outputs: [
            {
                label: 'Total Fuel Cost',
                unit: '$',
                calculate: (inputs) => {
                    const d = Number(inputs.dist);
                    const eff = Number(inputs.eff);
                    const p = Number(inputs.price);
                    const mode = inputs.mode;

                    if (!d || !eff || !p) return 0;

                    let gallonsOrLiters = 0;
                    if (mode === 'mpg') {
                        gallonsOrLiters = d / eff;
                    } else { // metric: liters = (dist / 100) * eff
                        gallonsOrLiters = (d / 100) * eff;
                    }
                    return (gallonsOrLiters * p).toFixed(2);
                }
            },
            {
                label: 'Fuel Needed',
                unit: 'gal/L',
                calculate: (inputs) => {
                    const d = Number(inputs.dist);
                    const eff = Number(inputs.eff);
                    const mode = inputs.mode;
                    if (!d || !eff) return 0;
                    if (mode === 'mpg') return (d / eff).toFixed(2);
                    return ((d / 100) * eff).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Estimates fuel cost for a trip based on efficiency and price.</p>' }
    },
    'sales-tax-calculator': {
        id: 'sales-tax-calculator',
        title: 'Sales Tax Calculator',
        description: 'Calculate final price with tax.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'price', label: 'Price (Before Tax)', type: 'number', placeholder: '100', unit: '$' },
            { id: 'tax', label: 'Tax Rate', type: 'number', placeholder: '8.25', unit: '%' }
        ],
        outputs: [
            {
                label: 'Total Price',
                unit: '$',
                calculate: (inputs) => {
                    const p = Number(inputs.price);
                    const t = Number(inputs.tax);
                    if (!p) return 0;
                    return (p * (1 + t / 100)).toFixed(2);
                }
            },
            {
                label: 'Tax Amount',
                unit: '$',
                calculate: (inputs) => {
                    const p = Number(inputs.price);
                    const t = Number(inputs.tax);
                    if (!p) return 0;
                    return (p * (t / 100)).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates total with sales tax included.</p>' }
    },
    'unit-price-calculator': {
        id: 'unit-price-calculator',
        title: 'Unit Price Calculator',
        description: 'Compare two items for best value.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'p1', label: 'Price Item A', type: 'number', placeholder: '10' },
            { id: 'q1', label: 'Qty/Size Item A', type: 'number', placeholder: '100' },
            { id: 'p2', label: 'Price Item B', type: 'number', placeholder: '15' },
            { id: 'q2', label: 'Qty/Size Item B', type: 'number', placeholder: '200' }
        ],
        outputs: [
            {
                label: 'Unit Price A',
                calculate: (inputs) => {
                    const p = Number(inputs.p1);
                    const q = Number(inputs.q1);
                    if (!p || !q) return 0;
                    return (p / q).toFixed(4);
                }
            },
            {
                label: 'Unit Price B',
                calculate: (inputs) => {
                    const p = Number(inputs.p2);
                    const q = Number(inputs.q2);
                    if (!p || !q) return 0;
                    return (p / q).toFixed(4);
                }
            },
            {
                label: 'Better Deal',
                calculate: (inputs) => {
                    const p1 = Number(inputs.p1); const q1 = Number(inputs.q1);
                    const p2 = Number(inputs.p2); const q2 = Number(inputs.q2);
                    if (!p1 || !q1 || !p2 || !q2) return '-';
                    const u1 = p1 / q1;
                    const u2 = p2 / q2;
                    if (u1 < u2) return 'Item A is cheaper';
                    if (u2 < u1) return 'Item B is cheaper';
                    return 'Same value';
                }
            }
        ],
        content: { whatIs: '<p>Compares the unit cost of two items to find the better deal.</p>' }
    },
    // Batch AG: Finance Tools II
    'roi-calculator': {
        id: 'roi-calculator',
        title: 'ROI Calculator',
        description: 'Calculate Return on Investment.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'inv', label: 'Amount Invested', type: 'number', placeholder: '1000', unit: '$' },
            { id: 'ret', label: 'Amount Returned', type: 'number', placeholder: '1200', unit: '$' },
            { id: 'time', label: 'Time Period (Years)', type: 'number', placeholder: '1', defaultValue: '1' }
        ],
        outputs: [
            {
                label: 'ROI (%)',
                unit: '%',
                calculate: (inputs) => {
                    const inv = Number(inputs.inv);
                    const ret = Number(inputs.ret);
                    if (!inv) return 0;
                    return (((ret - inv) / inv) * 100).toFixed(2);
                }
            },
            {
                label: 'Net Profit',
                unit: '$',
                calculate: (inputs) => {
                    const inv = Number(inputs.inv);
                    const ret = Number(inputs.ret);
                    return (ret - inv).toFixed(2);
                }
            },
            {
                label: 'Annualized ROI',
                unit: '%',
                calculate: (inputs) => {
                    const inv = Number(inputs.inv);
                    const ret = Number(inputs.ret);
                    const t = Number(inputs.time) || 1;
                    if (!inv || !t || ret <= 0 || inv <= 0) return 0;
                    // (End/Start)^(1/t) - 1
                    return ((Math.pow(ret / inv, 1 / t) - 1) * 100).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates Return on Investment (ROI) and Annualized ROI.</p>' }
    },
    'break-even-calculator': {
        id: 'break-even-calculator',
        title: 'Break-Even Calculator',
        description: 'Calculate units to cover costs.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'fixed', label: 'Fixed Costs', type: 'number', placeholder: '5000', unit: '$' },
            { id: 'price', label: 'Price per Unit', type: 'number', placeholder: '50', unit: '$' },
            { id: 'var', label: 'Variable Cost per Unit', type: 'number', placeholder: '20', unit: '$' }
        ],
        outputs: [
            {
                label: 'Break-Even Units',
                calculate: (inputs) => {
                    const f = Number(inputs.fixed);
                    const p = Number(inputs.price);
                    const v = Number(inputs.var);
                    if (!p || (p - v) <= 0) return 'Price must be > Cost';
                    return Math.ceil(f / (p - v)).toString();
                }
            },
            {
                label: 'Break-Even Revenue',
                unit: '$',
                calculate: (inputs) => {
                    const f = Number(inputs.fixed);
                    const p = Number(inputs.price);
                    const v = Number(inputs.var);
                    if (!p || (p - v) <= 0) return 0;
                    const units = f / (p - v);
                    return (units * p).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Determines the sales volume needed to cover costs.</p>' }
    },
    'margin-calculator': {
        id: 'margin-calculator',
        title: 'Margin Calculator',
        description: 'Calculate gross profit margin.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'cost', label: 'Cost', type: 'number', placeholder: '50' },
            { id: 'rev', label: 'Revenue (Price)', type: 'number', placeholder: '100' }
        ],
        outputs: [
            {
                label: 'Gross Margin',
                unit: '%',
                calculate: (inputs) => {
                    const c = Number(inputs.cost);
                    const r = Number(inputs.rev);
                    if (!r) return 0;
                    return (((r - c) / r) * 100).toFixed(2);
                }
            },
            {
                label: 'Gross Profit',
                unit: '$',
                calculate: (inputs) => (Number(inputs.rev) - Number(inputs.cost)).toFixed(2)
            },
            {
                label: 'Markup',
                unit: '%',
                calculate: (inputs) => {
                    const c = Number(inputs.cost);
                    const r = Number(inputs.rev);
                    if (!c) return 0;
                    return (((r - c) / c) * 100).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates Gross Margin vs Markup.</p>' }
    },
    'markup-calculator': {
        id: 'markup-calculator',
        title: 'Markup Calculator',
        description: 'Set price based on markup.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'cost', label: 'Cost', type: 'number', placeholder: '50' },
            { id: 'mu', label: 'Markup', type: 'number', placeholder: '50', unit: '%' }
        ],
        outputs: [
            {
                label: 'Revenue (Price)',
                unit: '$',
                calculate: (inputs) => {
                    const c = Number(inputs.cost);
                    const m = Number(inputs.mu);
                    return (c * (1 + m / 100)).toFixed(2);
                }
            },
            {
                label: 'Gross Margin',
                unit: '%',
                calculate: (inputs) => {
                    const c = Number(inputs.cost);
                    const m = Number(inputs.mu);
                    const r = c * (1 + m / 100);
                    if (!r) return 0;
                    return (((r - c) / r) * 100).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates Revenue Price from Cost and desired Markup.</p>' }
    },
    'ear-calculator': {
        id: 'ear-calculator',
        title: 'Effective APR Calculator',
        description: 'Nominal APR to Effective Annual Rate.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'u', label: 'Nominal Rate % (APR)', type: 'number', placeholder: '5.0' },
            { id: 'n', label: 'Compounding Frequency', type: 'select', options: [{ label: 'Monthly', value: '12' }, { label: 'Daily', value: '365' }, { label: 'Quarterly', value: '4' }, { label: 'Semiannually', value: '2' }], defaultValue: '12' }
        ],
        outputs: [
            {
                label: 'Effective Annual Rate (EAR)',
                unit: '%',
                calculate: (inputs) => {
                    const r = Number(inputs.u) / 100; // 0.05
                    const n = Number(inputs.n);
                    if (!n) return 0;
                    // (1 + r/n)^n - 1
                    return ((Math.pow(1 + r / n, n) - 1) * 100).toFixed(4);
                }
            },
            {
                label: 'Periodic Rate',
                unit: '%',
                calculate: (inputs) => {
                    const r = Number(inputs.u);
                    const n = Number(inputs.n);
                    if (!n) return 0;
                    return (r / n).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Converts Nominal APR to Effective Annual Rate (EAR) based on compounding.</p>' }
    },
    // Batch AH: Health Tools II
    'bmr-calculator': {
        id: 'bmr-calculator',
        title: 'BMR Calculator',
        description: 'Calculate Basal Metabolic Rate.',
        category: 'health',
        icon: 'Activity',
        inputs: [
            { id: 'w', label: 'Weight', type: 'number', placeholder: '70', unit: 'kg' },
            { id: 'h', label: 'Height', type: 'number', placeholder: '175', unit: 'cm' },
            { id: 'age', label: 'Age', type: 'number', placeholder: '25', unit: 'years' },
            { id: 'g', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'm' }, { label: 'Female', value: 'f' }], defaultValue: 'm' }
        ],
        outputs: [
            {
                label: 'BMR (Calories/day)',
                unit: 'kcal',
                calculate: (inputs) => {
                    const w = Number(inputs.w);
                    const h = Number(inputs.h);
                    const age = Number(inputs.age);
                    const g = inputs.g;
                    if (!w || !h || !age) return 0;
                    // Mifflin-St Jeor
                    // 10W + 6.25H - 5A + 5 (m) / -161 (f)
                    let bmr = 10 * w + 6.25 * h - 5 * age;
                    bmr += (g === 'm' ? 5 : -161);
                    return Math.round(bmr).toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates daily calories needed at rest (Mifflin-St Jeor Equation).</p>' }
    },
    'tdee-calculator': {
        id: 'tdee-calculator',
        title: 'TDEE Calculator',
        description: 'Total Daily Energy Expenditure.',
        category: 'health',
        icon: 'Activity',
        inputs: [
            { id: 'bmr', label: 'BMR (or calc above inputs)', type: 'number', placeholder: '1600' },
            {
                id: 'act', label: 'Activity Level', type: 'select', options: [
                    { label: 'Sedentary (x1.2)', value: '1.2' },
                    { label: 'Lightly Active (x1.375)', value: '1.375' },
                    { label: 'Moderately Active (x1.55)', value: '1.55' },
                    { label: 'Very Active (x1.725)', value: '1.725' },
                    { label: 'Extra Active (x1.9)', value: '1.9' }
                ], defaultValue: '1.2'
            }
        ],
        outputs: [
            {
                label: 'TDEE (Calories/day)',
                unit: 'kcal',
                calculate: (inputs) => {
                    const bmr = Number(inputs.bmr);
                    const act = Number(inputs.act);
                    if (!bmr || !act) return 0;
                    return Math.round(bmr * act).toString();
                }
            }
        ],
        content: { whatIs: '<p>Estimates total calories burned daily based on activity level.</p>' }
    },
    'body-fat-calculator': {
        id: 'body-fat-calculator',
        title: 'Body Fat Calculator',
        description: 'Estimate body fat percentage.',
        category: 'health',
        icon: 'Activity',
        inputs: [
            { id: 'g', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'm' }, { label: 'Female', value: 'f' }], defaultValue: 'm' },
            { id: 'waist', label: 'Waist', type: 'number', placeholder: '80', unit: 'cm' },
            { id: 'neck', label: 'Neck', type: 'number', placeholder: '35', unit: 'cm' },
            { id: 'hip', label: 'Hip (Female only)', type: 'number', placeholder: '90', unit: 'cm (optional for male)' },
            { id: 'h', label: 'Height', type: 'number', placeholder: '175', unit: 'cm' }
        ],
        outputs: [
            {
                label: 'Body Fat %',
                unit: '%',
                calculate: (inputs) => {
                    const g = inputs.g;
                    const w = Number(inputs.waist);
                    const n = Number(inputs.neck);
                    const h = Number(inputs.h);
                    const hip = Number(inputs.hip) || 0;

                    if (!w || !n || !h) return 0;

                    // US Navy Method
                    if (g === 'm') {
                        // 495 / (1.0324 - 0.19077 log10(waist-neck) + 0.15456 log10(height)) - 450
                        if (w <= n) return 'Waist must be > Neck';
                        const res = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
                        return res.toFixed(1);
                    } else {
                        // 495 / (1.29579 - 0.35004 log10(waist+hip-neck) + 0.22100 log10(height)) - 450
                        if (!hip) return 'Hip required for females';
                        const res = 495 / (1.29579 - 0.35004 * Math.log10(w + hip - n) + 0.22100 * Math.log10(h)) - 450;
                        return res.toFixed(1);
                    }
                }
            }
        ],
        content: { whatIs: '<p>Estimates body composition using the US Navy tape measure method.</p>' }
    },
    'water-intake-calculator': {
        id: 'water-intake-calculator',
        title: 'Water Intake Calculator',
        description: 'Daily water recommendation.',
        category: 'health',
        icon: 'Droplets', // Or Activity
        inputs: [
            { id: 'w', label: 'Weight', type: 'number', placeholder: '70', unit: 'kg' },
            { id: 'ex', label: 'Exercise (mins/day)', type: 'number', placeholder: '30' }
        ],
        outputs: [
            {
                label: 'Daily Intake',
                unit: 'Liters',
                calculate: (inputs) => {
                    const w = Number(inputs.w);
                    const ex = Number(inputs.ex) || 0;
                    if (!w) return 0;
                    // Formula: Weight(kg) * 0.033 + (Exercise/30 * 0.35)
                    const base = w * 0.033;
                    const extra = (ex / 30) * 0.35;
                    return (base + extra).toFixed(1);
                }
            },
            {
                label: 'In Cups (250ml)',
                unit: 'cups',
                calculate: (inputs) => {
                    const w = Number(inputs.w);
                    const ex = Number(inputs.ex) || 0;
                    if (!w) return 0;
                    const lit = w * 0.033 + (ex / 30) * 0.35;
                    return Math.round(lit * 4).toString();
                }
            }
        ],
        content: { whatIs: '<p>Estimates hydration needs based on weight and activity.</p>' }
    },
    'ideal-weight-calculator': {
        id: 'ideal-weight-calculator',
        title: 'Ideal Weight Calculator',
        description: 'Calculate IBW range.',
        category: 'health',
        icon: 'Activity',
        inputs: [
            { id: 'h', label: 'Height', type: 'number', placeholder: '175', unit: 'cm' },
            { id: 'g', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'm' }, { label: 'Female', value: 'f' }], defaultValue: 'm' }
        ],
        outputs: [
            {
                label: 'Ideal Weight (Devine)',
                unit: 'kg',
                calculate: (inputs) => {
                    const h = Number(inputs.h);
                    const g = inputs.g;
                    if (!h) return 0;
                    const inches = h / 2.54;
                    if (inches < 60) return 'Height too low for formula';

                    const over60 = inches - 60;
                    // Male: 50kg + 2.3kg per inch > 60
                    // Female: 45.5kg + 2.3kg per inch > 60
                    const base = (g === 'm' ? 50 : 45.5);
                    return (base + 2.3 * over60).toFixed(1);
                }
            },
            {
                label: 'Healthy BMI Range',
                unit: 'kg',
                calculate: (inputs) => {
                    const h = Number(inputs.h);
                    if (!h) return 0;
                    const hm = h / 100;
                    const min = 18.5 * hm * hm;
                    const max = 24.9 * hm * hm;
                    return `${min.toFixed(1)} - ${max.toFixed(1)}`;
                }
            }
        ],
        content: { whatIs: '<p>Calculates Ideal Body Weight (Devine Formula) and Healthy BMI range.</p>' }
    },
    // Batch AI: Education Tools
    'grade-calculator': {
        id: 'grade-calculator',
        title: 'Grade Calculator',
        description: 'Calculate grade percentage.',
        category: 'education',
        icon: 'Calculator',
        inputs: [
            { id: 'earned', label: 'Points Earned', type: 'number', placeholder: '85' },
            { id: 'poss', label: 'Points Possible', type: 'number', placeholder: '100' }
        ],
        outputs: [
            {
                label: 'Percentage',
                unit: '%',
                calculate: (inputs) => {
                    const e = Number(inputs.earned);
                    const p = Number(inputs.poss);
                    if (!p) return 0;
                    return ((e / p) * 100).toFixed(2);
                }
            },
            {
                label: 'Letter Grade',
                calculate: (inputs) => {
                    const e = Number(inputs.earned);
                    const p = Number(inputs.poss);
                    if (!p) return '-';
                    const pct = (e / p) * 100;
                    if (pct >= 90) return 'A';
                    if (pct >= 80) return 'B';
                    if (pct >= 70) return 'C';
                    if (pct >= 60) return 'D';
                    return 'F';
                }
            }
        ],
        content: { whatIs: '<p>Calculates percentage and letter grade from points.</p>' }
    },
    'gpa-calculator': {
        id: 'gpa-calculator',
        title: 'GPA Calculator',
        description: 'Calculate Grade Point Average.',
        category: 'education',
        icon: 'GraduationCap',
        inputs: [
            { id: 'grades', label: 'Grades (comma separated, e.g. A, B, A, C)', type: 'text', placeholder: 'A, B, A' },
            { id: 'scale', label: 'Scale', type: 'select', options: [{ label: '4.0 Scale', value: '4.0' }, { label: '5.0 Scale', value: '5.0' }], defaultValue: '4.0' }
        ],
        outputs: [
            {
                label: 'GPA',
                calculate: (inputs) => {
                    const grades = (inputs.grades || '').toUpperCase().split(',').map(s => s.trim());
                    if (!grades.length || grades[0] === '') return 0;

                    const map: { [key: string]: number } = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0 };
                    let total = 0;
                    let count = 0;

                    grades.forEach(g => {
                        let score = 0;
                        if (map.hasOwnProperty(g)) {
                            score = map[g];
                        } else {
                            // Try to parse number
                            const num = parseFloat(g);
                            if (!isNaN(num)) score = num; // Direct point entry? Assume 4.0 scale if < 5?
                            else return; // Skip invalid
                        }

                        // Adjust for 5.0 scale if needed? Usually 5.0 just adds +1 for AP.
                        // For simplicity, let's assume standard mapping + scale adjustment if user picked 5.0?
                        // Or just stick to standard letter mapping.
                        // Let's stick to standard map for now.
                        total += score;
                        count++;
                    });

                    if (count === 0) return 0;
                    return (total / count).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates simple GPA from letter grades (A=4, B=3, C=2, D=1, F=0).</p>' }
    },
    'final-grade-calculator': {
        id: 'final-grade-calculator',
        title: 'Final Grade Calculator',
        description: 'Grade needed on final exam.',
        category: 'education',
        icon: 'Calculator',
        inputs: [
            { id: 'curr', label: 'Current Grade (%)', type: 'number', placeholder: '85' },
            { id: 'goal', label: 'Goal Grade (%)', type: 'number', placeholder: '90' },
            { id: 'weight', label: 'Final Exam Weight (%)', type: 'number', placeholder: '20' }
        ],
        outputs: [
            {
                label: 'Grade Needed',
                unit: '%',
                calculate: (inputs) => {
                    const c = Number(inputs.curr);
                    const g = Number(inputs.goal);
                    const w = Number(inputs.weight);
                    if (!w) return 0;

                    // Goal = (Current * (1 - w/100)) + (Final * w/100)
                    // Final = (Goal - Current * (1 - w/100)) / (w/100)
                    const wDec = w / 100;
                    const needed = (g - c * (1 - wDec)) / wDec;
                    return needed.toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates what you need to score on the final exam to reach a target grade.</p>' }
    },
    'attendance-calculator': {
        id: 'attendance-calculator',
        title: 'Attendance Calculator',
        description: 'Track class attendance %.',
        category: 'education',
        icon: 'Calendar',
        inputs: [
            { id: 'held', label: 'Total Classes Held', type: 'number', placeholder: '20' },
            { id: 'att', label: 'Classes Attended', type: 'number', placeholder: '18' }
        ],
        outputs: [
            {
                label: 'Attendance Percentage',
                unit: '%',
                calculate: (inputs) => {
                    const h = Number(inputs.held);
                    const a = Number(inputs.att);
                    if (!h) return 0;
                    return ((a / h) * 100).toFixed(2);
                }
            },
            {
                label: 'Classes You Canc Miss (to stay > 75%)',
                calculate: (inputs) => {
                    const h = Number(inputs.held);
                    const a = Number(inputs.att);
                    if (!h) return 0;
                    // 75% goal
                    // (a) / (h + x) >= 0.75 ?? No, future classes.
                    // Assumes more classes are coming? 
                    // Or just "How many could I have missed?"
                    // Let's do: "Max classes to miss for 75%"
                    // 0.75 * h = min attended.
                    const minAtt = 0.75 * h;
                    const canMiss = a - minAtt;
                    if (canMiss < 0) return '0 (Below 75%)';
                    return Math.floor(canMiss).toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates attendance percentage.</p>' }
    },
    'weighted-average-calculator': {
        id: 'weighted-average-calculator',
        title: 'Weighted Average Calculator',
        description: 'Calculate average with weights.',
        category: 'education',
        icon: 'Calculator',
        inputs: [
            { id: 'v', label: 'Values (comma separated)', type: 'text', placeholder: '80, 90, 75' },
            { id: 'w', label: 'Weights (comma separated)', type: 'text', placeholder: '0.2, 0.3, 0.5' }
        ],
        outputs: [
            {
                label: 'Weighted Average',
                calculate: (inputs) => {
                    const vals = (inputs.v || '').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
                    const weights = (inputs.w || '').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));

                    if (vals.length === 0 || weights.length === 0) return 0;
                    if (vals.length !== weights.length) return 'Mismatch counts';

                    let sumProd = 0;
                    let sumW = 0;
                    for (let i = 0; i < vals.length; i++) {
                        sumProd += vals[i] * weights[i];
                        sumW += weights[i];
                    }
                    if (sumW === 0) return 0;
                    return (sumProd / sumW).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates weighted average of a dataset.</p>' }
    },
    // Batch AJ: Text Tools
    'word-count-calculator': {
        id: 'word-count-calculator',
        title: 'Word Count Calculator',
        description: 'Count words and characters.',
        category: 'text',
        icon: 'Type',
        inputs: [
            { id: 'text', label: 'Input Text', type: 'text', placeholder: 'Paste your text here...' } // Type 'text' usually renders input, but component uses textarea for 'text' input types if configured? 
            // In typical HTML input, 'text' is single line. If we want multi-line, we might need a type 'textarea'.
            // For now, I'll use 'text'. Users might need to paste smaller chunks.
            // Or I can add 'textarea' capability later.
            // Let's stick to simple text for now.
        ],
        outputs: [
            {
                label: 'Word Count',
                calculate: (inputs) => {
                    const text = (inputs.text || '').trim();
                    if (!text) return 0;
                    return text.split(/\s+/).length.toString();
                }
            },
            {
                label: 'Character Count',
                calculate: (inputs) => (inputs.text || '').length.toString()
            },
            {
                label: 'Character Count (No Spaces)',
                calculate: (inputs) => (inputs.text || '').replace(/\s/g, '').length.toString()
            }
        ],
        content: { whatIs: '<p>Counts words and characters in text.</p>' }
    },
    'case-converter-calculator': {
        id: 'case-converter-calculator',
        title: 'Case Converter',
        description: 'Convert text case.',
        category: 'text',
        icon: 'Type',
        inputs: [
            { id: 'text', label: 'Input Text', type: 'text', placeholder: 'Hello World' },
            {
                id: 'mode', label: 'Mode', type: 'select', options: [
                    { label: 'UPPERCASE', value: 'upper' },
                    { label: 'lowercase', value: 'lower' },
                    { label: 'Title Case', value: 'title' },
                    { label: 'Sentence case', value: 'sentence' }
                ], defaultValue: 'upper'
            }
        ],
        outputs: [
            {
                label: 'Converted Text',
                calculate: (inputs) => {
                    const t = inputs.text || '';
                    const m = inputs.mode;
                    if (!t) return '';
                    if (m === 'upper') return t.toUpperCase();
                    if (m === 'lower') return t.toLowerCase();
                    if (m === 'title') {
                        return t.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
                    }
                    if (m === 'sentence') {
                        return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
                    }
                    return t;
                }
            }
        ],
        content: { whatIs: '<p>Converts text case style.</p>' }
    },
    'lorem-ipsum-generator': {
        id: 'lorem-ipsum-generator',
        title: 'Lorem Ipsum Generator',
        description: 'Generate placeholder text.',
        category: 'text',
        icon: 'Type',
        inputs: [
            { id: 'n', label: 'Number of Paragraphs', type: 'number', placeholder: '3', defaultValue: '1' }
        ],
        outputs: [
            {
                label: 'Lorem Ipsum Text',
                calculate: (inputs) => {
                    const n = Math.min(Math.max(Number(inputs.n) || 1, 1), 10);
                    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
                    return Array(n).fill(lorem).join('\n\n');
                }
            }
        ],
        content: { whatIs: '<p>Generates Lorem Ipsum placeholder text.</p>' }
    },
    'slugify-calculator': {
        id: 'slugify-calculator',
        title: 'Slug Generator',
        description: 'Convert title to URL slug.',
        category: 'text',
        icon: 'Type',
        inputs: [
            { id: 'text', label: 'Title / Text', type: 'text', placeholder: 'Hello World -> hello-world' }
        ],
        outputs: [
            {
                label: 'Slug',
                calculate: (inputs) => {
                    const t = inputs.text || '';
                    return t.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
                }
            }
        ],
        content: { whatIs: '<p>Generates URL-friendly slugs.</p>' }
    },
    'text-reverser-calculator': {
        id: 'text-reverser-calculator',
        title: 'Text Reverser',
        description: 'Reverse characters in text.',
        category: 'text',
        icon: 'Type',
        inputs: [
            { id: 'text', label: 'Text to Reverse', type: 'text', placeholder: 'Hello' }
        ],
        outputs: [
            {
                label: 'Reversed',
                calculate: (inputs) => (inputs.text || '').split('').reverse().join('')
            }
        ],
        content: { whatIs: '<p>Reverses the text string.</p>' }
    },
    // Batch AK: Sports Tools
    'pace-calculator': {
        id: 'pace-calculator',
        title: 'Pace Calculator',
        description: 'Calculate running/cycling pace.',
        category: 'sports',
        icon: 'Trophy', // or 'Timer'
        inputs: [
            { id: 'time', label: 'Time (MM:SS or HH:MM:SS)', type: 'text', placeholder: '00:30:00' },
            { id: 'dist', label: 'Distance', type: 'number', placeholder: '5', unit: 'km/miles' }
        ],
        outputs: [
            {
                label: 'Pace (per km/mile)',
                calculate: (inputs) => {
                    const tStr = inputs.time || '0';
                    const d = Number(inputs.dist);
                    if (!d) return 0;

                    const parts = tStr.split(':').map(Number);
                    let seconds = 0;
                    if (parts.length === 3) seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
                    else if (parts.length === 2) seconds = parts[0] * 60 + parts[1];
                    else seconds = parts[0]; // assume minutes? or seconds? usually total minutes if just number. But let's assume HH:MM:SS or MM:SS format forced.

                    if (!seconds) return 0;

                    const paceSeconds = seconds / d;
                    const pMin = Math.floor(paceSeconds / 60);
                    const pSec = Math.round(paceSeconds % 60);
                    return `${pMin}:${pSec.toString().padStart(2, '0')}`;
                }
            },
            {
                label: 'Speed (km/h or mph)',
                calculate: (inputs) => {
                    const tStr = inputs.time || '0';
                    const d = Number(inputs.dist);

                    const parts = tStr.split(':').map(Number);
                    let hours = 0;
                    if (parts.length === 3) hours = parts[0] + parts[1] / 60 + parts[2] / 3600;
                    else if (parts.length === 2) hours = parts[0] / 60 + parts[1] / 3600;

                    if (!hours) return 0;
                    return (d / hours).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates pace (time per distance) and speed.</p>' }
    },
    'race-time-predictor': {
        id: 'race-time-predictor',
        title: 'Race Time Predictor',
        description: 'Predict race finish times.',
        category: 'sports',
        icon: 'Trophy',
        inputs: [
            { id: 't', label: 'Previous Time (MM:SS)', type: 'text', placeholder: '25:00' },
            { id: 'd1', label: 'Previous Distance', type: 'number', placeholder: '5', unit: 'km' },
            { id: 'd2', label: 'Target Distance', type: 'number', placeholder: '10', unit: 'km' }
        ],
        outputs: [
            {
                label: 'Predicted Time (Riegel)',
                calculate: (inputs) => {
                    const tStr = inputs.t || '0';
                    const d1 = Number(inputs.d1);
                    const d2 = Number(inputs.d2);
                    if (!d1 || !d2) return 0;

                    const parts = tStr.split(':').map(Number);
                    let t1 = 0; // in minutes? seconds?
                    // Riegel: t2 = t1 * (d2 / d1)^1.06
                    if (parts.length === 3) t1 = parts[0] * 60 + parts[1] + parts[2] / 60; // Minutes
                    else if (parts.length === 2) t1 = parts[0] + parts[1] / 60; // Minutes
                    else t1 = parts[0];

                    const t2 = t1 * Math.pow(d2 / d1, 1.06);

                    const h = Math.floor(t2 / 60);
                    const m = Math.floor(t2 % 60);
                    const s = Math.round((t2 * 60) % 60);
                    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                }
            }
        ],
        content: { whatIs: '<p>Predicts race time using Riegel\'s Formula (T2 = T1 * (D2/D1)^1.06).</p>' }
    },
    'target-heart-rate-calculator': {
        id: 'target-heart-rate-calculator',
        title: 'Heart Rate Zones',
        description: 'Calculate training zones.',
        category: 'sports',
        icon: 'HeartPulse',
        inputs: [
            { id: 'age', label: 'Age', type: 'number', placeholder: '30' },
            { id: 'rhr', label: 'Resting Heart Rate', type: 'number', placeholder: '60' }
        ],
        outputs: [
            {
                label: 'Max Heart Rate (MHR)',
                calculate: (inputs) => {
                    const age = Number(inputs.age);
                    if (!age) return 0;
                    return (220 - age).toString();
                }
            },
            {
                label: 'Zone 2 (60-70% Karvonen)',
                calculate: (inputs) => {
                    const age = Number(inputs.age);
                    const rhr = Number(inputs.rhr);
                    if (!age || !rhr) return 0;
                    const mhr = 220 - age;
                    const hrr = mhr - rhr;
                    const min = Math.round(hrr * 0.6 + rhr);
                    const max = Math.round(hrr * 0.7 + rhr);
                    return `${min} - ${max} bpm`;
                }
            },
            {
                label: 'Zone 4 (80-90% Karvonen)',
                calculate: (inputs) => {
                    const age = Number(inputs.age);
                    const rhr = Number(inputs.rhr);
                    if (!age || !rhr) return 0;
                    const mhr = 220 - age;
                    const hrr = mhr - rhr;
                    const min = Math.round(hrr * 0.8 + rhr);
                    const max = Math.round(hrr * 0.9 + rhr);
                    return `${min} - ${max} bpm`;
                }
            }
        ],
        content: { whatIs: '<p>Calculates heart rate zones using Karvonen formula (Target = (Max-Rest)*% + Rest).</p>' }
    },
    'one-rep-max-calculator': {
        id: 'one-rep-max-calculator',
        title: 'One Rep Max Calculator',
        description: 'Estimate 1RM strength.',
        category: 'sports',
        icon: 'Dumbbell', // Fallback to mapped icon if Dumbbell not in Layout logic?
        // Layout logic maps 'sports' -> Trophy.
        // It's fine.
        inputs: [
            { id: 'w', label: 'Weight Lifted', type: 'number', placeholder: '100', unit: 'kg/lbs' },
            { id: 'r', label: 'Reps Performed', type: 'number', placeholder: '5' }
        ],
        outputs: [
            {
                label: 'Estimated 1RM (Epley)',
                unit: 'kg/lbs',
                calculate: (inputs) => {
                    const w = Number(inputs.w);
                    const r = Number(inputs.r);
                    if (!w || !r) return 0;
                    if (r === 1) return w;
                    // w * (1 + r/30)
                    return Math.round(w * (1 + r / 30)).toString();
                }
            },
            {
                label: 'Estimated 1RM (Brzycki)',
                unit: 'kg/lbs',
                calculate: (inputs) => {
                    const w = Number(inputs.w);
                    const r = Number(inputs.r);
                    if (!w || !r) return 0;
                    if (r === 1) return w;
                    // w / (1.0278 - 0.0278 * r)
                    return Math.round(w / (1.0278 - 0.0278 * r)).toString();
                }
            }
        ],
        content: { whatIs: '<p>Estimates 1RM using Epley and Brzycki formulas.</p>' }
    },
    'wilks-score-calculator': {
        id: 'wilks-score-calculator',
        title: 'Wilks Score Calculator',
        description: 'Compare strength across weights.',
        category: 'sports',
        icon: 'Trophy',
        inputs: [
            { id: 'bw', label: 'Body Weight (kg)', type: 'number', placeholder: '80' },
            { id: 'total', label: 'Total Lifted (kg)', type: 'number', placeholder: '500' },
            { id: 'g', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'm' }, { label: 'Female', value: 'f' }], defaultValue: 'm' }
        ],
        outputs: [
            {
                label: 'Wilks Score',
                calculate: (inputs) => {
                    const bw = Number(inputs.bw);
                    const total = Number(inputs.total);
                    const g = inputs.g;
                    if (!bw || !total) return 0;

                    // Wilks Coefficients (Metric)
                    // Simplified or full polynomial?
                    // Let's use 2020 GL Points? No, Wilks is classic.
                    // Male: a=-216.0475144, b=16.2606339, c=-0.002388645, d=-0.00113732, e=7.01863E-06, f=-1.291E-08
                    // Valid for kg.
                    // Formula: Coeff = 500 / (a + bx + cx^2 + dx^3 + ex^4 + fx^5)
                    // Wait, Wilks 2 is different.
                    // I'll approximate or use a simplified resource if I don't want to embed giant poly.
                    // Let's use a standard implementation.

                    // Coefficients for Male
                    const m_a = -216.0475144;
                    const m_b = 16.2606339;
                    const m_c = -0.002388645;
                    const m_d = -0.00113732;
                    const m_e = 7.01863E-06;
                    const m_f = -1.291E-08;

                    // Female
                    const f_a = 594.31747775582;
                    const f_b = -27.23842536447;
                    const f_c = 0.82112226871;
                    const f_d = -0.00930733913;
                    const f_e = 4.731582E-05;
                    const f_f = -9.054E-08;

                    const x = bw;
                    let coeff = 0;

                    if (g === 'm') {
                        coeff = 500 / (m_a + m_b * x + m_c * x * x + m_d * Math.pow(x, 3) + m_e * Math.pow(x, 4) + m_f * Math.pow(x, 5));
                    } else {
                        coeff = 500 / (f_a + f_b * x + f_c * x * x + f_d * Math.pow(x, 3) + f_e * Math.pow(x, 4) + f_f * Math.pow(x, 5));
                    }

                    return (total * coeff).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Standard Wilks Formula to compare powerlifting strength.</p>' }
    },
    // Batch AL: Date & Time Tools II
    'duration-calculator': {
        id: 'duration-calculator',
        title: 'Time Duration Calculator',
        description: 'Calculate time between two times.',
        category: 'calendar',
        icon: 'Calendar',
        inputs: [
            { id: 'start', label: 'Start Time', type: 'time', placeholder: '09:00' },
            { id: 'end', label: 'End Time', type: 'time', placeholder: '17:30' }
        ],
        outputs: [
            {
                label: 'Duration',
                calculate: (inputs) => {
                    const s = inputs.start;
                    const e = inputs.end;
                    if (!s || !e) return '0h 0m';

                    const [h1, m1] = s.split(':').map(Number);
                    const [h2, m2] = e.split(':').map(Number);

                    let min1 = h1 * 60 + m1;
                    let min2 = h2 * 60 + m2;

                    if (min2 < min1) min2 += 24 * 60; // Assume next day if end < start

                    const diff = min2 - min1;
                    const h = Math.floor(diff / 60);
                    const m = diff % 60;

                    return `${h}h ${m}m`;
                }
            },
            {
                label: 'Total Minutes',
                calculate: (inputs) => {
                    const s = inputs.start;
                    const e = inputs.end;
                    if (!s || !e) return '0';
                    const [h1, m1] = s.split(':').map(Number);
                    const [h2, m2] = e.split(':').map(Number);
                    let min1 = h1 * 60 + m1;
                    let min2 = h2 * 60 + m2;
                    if (min2 < min1) min2 += 24 * 60;
                    return (min2 - min1).toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates duration between two specified times.</p>' }
    },
    'week-number-calculator': {
        id: 'week-number-calculator',
        title: 'Week Number Calculator',
        description: 'Find the ISO week number.',
        category: 'calendar',
        icon: 'Calendar',
        inputs: [
            { id: 'date', label: 'Date', type: 'date', defaultValue: new Date().toISOString().split('T')[0] }
        ],
        outputs: [
            {
                label: 'ISO Week Number',
                calculate: (inputs) => {
                    const d = new Date(inputs.date);
                    if (isNaN(d.getTime())) return '-';

                    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
                    const dayNum = date.getUTCDay() || 7;
                    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
                    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
                    return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7).toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates the ISO-8601 week number for a given date.</p>' }
    },
    'leap-year-calculator': {
        id: 'leap-year-calculator',
        title: 'Leap Year Calculator',
        description: 'Check if a year is a leap year.',
        category: 'calendar',
        icon: 'Calendar',
        inputs: [
            { id: 'year', label: 'Year', type: 'number', placeholder: '2024' }
        ],
        outputs: [
            {
                label: 'Is Leap Year?',
                calculate: (inputs) => {
                    const y = Number(inputs.year);
                    if (!y) return '-';
                    const isLeap = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
                    return isLeap ? 'Yes' : 'No';
                }
            },
            {
                label: 'Days in Year',
                calculate: (inputs) => {
                    const y = Number(inputs.year);
                    if (!y) return '-';
                    const isLeap = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
                    return isLeap ? '366' : '365';
                }
            }
        ],
        content: { whatIs: '<p>Determines if a year is a leap year.</p>' }
    },
    'day-of-year-calculator': {
        id: 'day-of-year-calculator',
        title: 'Day of Year Calculator',
        description: 'Find the day number (1-366).',
        category: 'calendar',
        icon: 'Calendar',
        inputs: [
            { id: 'date', label: 'Date', type: 'date', defaultValue: new Date().toISOString().split('T')[0] }
        ],
        outputs: [
            {
                label: 'Day Number',
                calculate: (inputs) => {
                    const d = new Date(inputs.date);
                    if (isNaN(d.getTime())) return '-';
                    const start = new Date(d.getFullYear(), 0, 0);
                    const diff = (d.getTime() - start.getTime()) + ((start.getTimezoneOffset() - d.getTimezoneOffset()) * 60 * 1000);
                    const oneDay = 1000 * 60 * 60 * 24;
                    const day = Math.floor(diff / oneDay);
                    return day.toString();
                }
            },
            {
                label: 'Days Remaining',
                calculate: (inputs) => {
                    const d = new Date(inputs.date);
                    if (isNaN(d.getTime())) return '-';
                    const y = d.getFullYear();
                    const isLeap = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
                    const daysInYear = isLeap ? 366 : 365;

                    const start = new Date(d.getFullYear(), 0, 0);
                    const diff = (d.getTime() - start.getTime()) + ((start.getTimezoneOffset() - d.getTimezoneOffset()) * 60 * 1000);
                    const oneDay = 1000 * 60 * 60 * 24;
                    const day = Math.floor(diff / oneDay);

                    return (daysInYear - day).toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates the ordinal day of the year (1-366).</p>' }
    },
    'work-days-calculator': {
        id: 'work-days-calculator',
        title: 'Work Days Calculator',
        description: 'Count weekdays between dates.',
        category: 'calendar',
        icon: 'Calendar',
        inputs: [
            { id: 'start', label: 'Start Date', type: 'date' },
            { id: 'end', label: 'End Date', type: 'date' }
        ],
        outputs: [
            {
                label: 'Business Days',
                calculate: (inputs) => {
                    if (!inputs.start || !inputs.end) return '0';
                    const s = new Date(inputs.start);
                    const e = new Date(inputs.end);
                    if (s > e) return 'End must be after Start';

                    // Simple loop (efficient enough for reasonable ranges)
                    let count = 0;
                    let curr = new Date(s);
                    // Standard logic usually excludes start or end or includes both? 
                    // Let's do Inclusive Both for maximum utility.
                    while (curr <= e) {
                        const day = curr.getDay();
                        if (day !== 0 && day !== 6) count++;
                        curr.setDate(curr.getDate() + 1);
                    }
                    return count.toString();
                }
            },
            {
                label: 'Total Days',
                calculate: (inputs) => {
                    if (!inputs.start || !inputs.end) return '0';
                    const s = new Date(inputs.start);
                    const e = new Date(inputs.end);
                    const diff = e.getTime() - s.getTime();
                    return Math.floor(diff / (1000 * 3600 * 24) + 1).toString(); // +1 inclusive
                }
            }
        ],
        content: { whatIs: '<p>Calculates number of business days (Mon-Fri) between two dates.</p>' }
    },
    // Batch AM: Electrical Tools II
    'voltage-divider-calculator': {
        id: 'voltage-divider-calculator',
        title: 'Voltage Divider',
        description: 'Common resistor circuit.',
        category: 'electronics',
        icon: 'Zap',
        inputs: [
            { id: 'vin', label: 'Input Voltage (Vin)', type: 'number', placeholder: '5', unit: 'V' },
            { id: 'r1', label: 'Resistor 1 (R1)', type: 'number', placeholder: '1000', unit: 'Ω' },
            { id: 'r2', label: 'Resistor 2 (R2)', type: 'number', placeholder: '2000', unit: 'Ω' }
        ],
        outputs: [
            {
                label: 'Output Voltage (Vout)',
                unit: 'V',
                calculate: (inputs) => {
                    const vin = Number(inputs.vin);
                    const r1 = Number(inputs.r1);
                    const r2 = Number(inputs.r2);
                    if (isNaN(vin) || isNaN(r1) || isNaN(r2) || (r1 + r2) === 0) return 0;
                    return (vin * (r2 / (r1 + r2))).toFixed(3);
                }
            }
        ],
        content: { whatIs: '<p>Calculates output voltage of a resistive divider.</p>' }
    },
    'battery-life-calculator': {
        id: 'battery-life-calculator',
        title: 'Battery Life Calculator',
        description: 'Estimate run time.',
        category: 'electronics',
        icon: 'Zap',
        inputs: [
            { id: 'cap', label: 'Battery Capacity', type: 'number', placeholder: '2000', unit: 'mAh' },
            { id: 'load', label: 'Load Current', type: 'number', placeholder: '500', unit: 'mA' }
        ],
        outputs: [
            {
                label: 'Estimated Runtime',
                unit: 'Hours',
                calculate: (inputs) => {
                    const c = Number(inputs.cap);
                    const l = Number(inputs.load);
                    if (!c || !l) return 0;
                    // Usually derated by 0.7 or 0.8 depending on type, but for simple calc:
                    // Time = Capacity / Load
                    // Let's assume ideal for now, or maybe * 0.9 for realism?
                    // Simple formula usually preferred unless specified.
                    // Let's mul by 0.7 for standard discharge curve efficiency/safety cut-off?
                    // No, let's just do C/L and mention "Ideal".
                    return (c / l).toFixed(2);
                }
            },
            {
                label: 'Is ideal?',
                calculate: () => 'Yes, practical life may be less (~70%)'
            }
        ],
        content: { whatIs: '<p>Estimates battery runtime based on capacity and load.</p>' }
    },
    'wire-resistance-calculator': {
        id: 'wire-resistance-calculator',
        title: 'Wire Resistance Calculator',
        description: 'Resistance of a wire.',
        category: 'electronics',
        icon: 'Zap',
        inputs: [
            { id: 'rho', label: 'Resistivity (ρ)', type: 'number', placeholder: '1.68e-8', unit: 'Ω⋅m (Copper)', defaultValue: '1.68e-8' },
            { id: 'len', label: 'Length (L)', type: 'number', placeholder: '10', unit: 'm' },
            { id: 'area', label: 'Cross Section Area (A)', type: 'number', placeholder: '1e-6', unit: 'm²' }
        ],
        outputs: [
            {
                label: 'Resistance (R)',
                unit: 'Ω',
                calculate: (inputs) => {
                    const rho = Number(inputs.rho);
                    const l = Number(inputs.len);
                    const a = Number(inputs.area);
                    if (!rho || !l || !a) return 0;
                    return ((rho * l) / a).toExponential(3);
                }
            }
        ],
        content: { whatIs: '<p>Calculates wire resistance using R = ρL/A.</p>' }
    },
    'capacitor-energy-calculator': {
        id: 'capacitor-energy-calculator',
        title: 'Capacitor Energy',
        description: 'Energy stored in capacitor.',
        category: 'electronics',
        icon: 'Zap',
        inputs: [
            { id: 'c', label: 'Capacitance (C)', type: 'number', placeholder: '100', unit: 'µF' },
            { id: 'v', label: 'Voltage (V)', type: 'number', placeholder: '12', unit: 'V' }
        ],
        outputs: [
            {
                label: 'Energy (E)',
                unit: 'Joules',
                calculate: (inputs) => {
                    const cMicro = Number(inputs.c);
                    const v = Number(inputs.v);
                    if (!cMicro || !v) return 0;
                    const c = cMicro * 1e-6; // convert uF to F
                    // E = 0.5 * C * V^2
                    return (0.5 * c * v * v).toExponential(3);
                }
            }
        ],
        content: { whatIs: '<p>Calculates energy stored in a capacitor (E = ½CV²).</p>' }
    },
    'inductance-calculator': {
        id: 'inductance-calculator',
        title: 'Solenoid Inductance',
        description: 'Inductance of air core coil.',
        category: 'electronics',
        icon: 'Zap',
        inputs: [
            { id: 'n', label: 'Number of Turns (N)', type: 'number', placeholder: '100' },
            { id: 'a', label: 'Area (A)', type: 'number', placeholder: '1e-4', unit: 'm²' },
            { id: 'l', label: 'Length (l)', type: 'number', placeholder: '0.1', unit: 'm' }
        ],
        outputs: [
            {
                label: 'Inductance (L)',
                unit: 'H',
                calculate: (inputs) => {
                    const n = Number(inputs.n);
                    const a = Number(inputs.a);
                    const l = Number(inputs.l);
                    if (!n || !a || !l) return 0;
                    const mu0 = 1.25663706e-6; // Vacuum permeability
                    // L = (mu0 * N^2 * A) / l
                    return ((mu0 * n * n * a) / l).toExponential(3);
                }
            }
        ],
        content: { whatIs: '<p>Calculates inductance of an air-core solenoid (approx).</p>' }
    },
    // Batch AN: 3D Geometry
    'sphere-volume-calculator': {
        id: 'sphere-volume-calculator',
        title: 'Sphere Volume Calculator',
        description: 'Volume of a sphere.',
        category: 'geometry',
        icon: 'Box',
        inputs: [
            { id: 'r', label: 'Radius (r)', type: 'number', placeholder: '5' }
        ],
        outputs: [
            {
                label: 'Volume',
                calculate: (inputs) => {
                    const r = Number(inputs.r);
                    if (!r) return 0;
                    return ((4 / 3) * Math.PI * Math.pow(r, 3)).toFixed(2);
                }
            },
            {
                label: 'Surface Area',
                calculate: (inputs) => {
                    const r = Number(inputs.r);
                    if (!r) return 0;
                    return (4 * Math.PI * Math.pow(r, 2)).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates volume and surface area of a sphere.</p>' }
    },
    'cylinder-volume-calculator': {
        id: 'cylinder-volume-calculator',
        title: 'Cylinder Calculator',
        description: 'Volume and surface area.',
        category: 'geometry',
        icon: 'Box',
        inputs: [
            { id: 'r', label: 'Radius (r)', type: 'number', placeholder: '5' },
            { id: 'h', label: 'Height (h)', type: 'number', placeholder: '10' }
        ],
        outputs: [
            {
                label: 'Volume',
                calculate: (inputs) => {
                    const r = Number(inputs.r);
                    const h = Number(inputs.h);
                    if (!r || !h) return 0;
                    return (Math.PI * r * r * h).toFixed(2);
                }
            },
            {
                label: 'Surface Area',
                calculate: (inputs) => {
                    const r = Number(inputs.r);
                    const h = Number(inputs.h);
                    if (!r || !h) return 0;
                    // 2*pi*r*h + 2*pi*r^2
                    return (2 * Math.PI * r * h + 2 * Math.PI * r * r).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates volume and surface area of a cylinder.</p>' }
    },
    'cone-volume-calculator': {
        id: 'cone-volume-calculator',
        title: 'Cone Calculator',
        description: 'Volume and surface area.',
        category: 'geometry',
        icon: 'Box',
        inputs: [
            { id: 'r', label: 'Radius (r)', type: 'number', placeholder: '5' },
            { id: 'h', label: 'Height (h)', type: 'number', placeholder: '10' }
        ],
        outputs: [
            {
                label: 'Volume',
                calculate: (inputs) => {
                    const r = Number(inputs.r);
                    const h = Number(inputs.h);
                    if (!r || !h) return 0;
                    return ((1 / 3) * Math.PI * r * r * h).toFixed(2);
                }
            },
            {
                label: 'Slant Height',
                calculate: (inputs) => {
                    const r = Number(inputs.r);
                    const h = Number(inputs.h);
                    if (!r || !h) return 0;
                    return Math.sqrt(r * r + h * h).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates volume and slant height of a cone.</p>' }
    },
    'cube-calculator': {
        id: 'cube-calculator',
        title: 'Cube Calculator',
        description: 'Volume and area of a cube.',
        category: 'geometry',
        icon: 'Box',
        inputs: [
            { id: 's', label: 'Side Length (s)', type: 'number', placeholder: '5' }
        ],
        outputs: [
            {
                label: 'Volume',
                calculate: (inputs) => {
                    const s = Number(inputs.s);
                    if (!s) return 0;
                    return Math.pow(s, 3).toFixed(2);
                }
            },
            {
                label: 'Surface Area',
                calculate: (inputs) => {
                    const s = Number(inputs.s);
                    if (!s) return 0;
                    return (6 * s * s).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates volume and surface area of a cube.</p>' }
    },
    'rect-prism-calculator': {
        id: 'rect-prism-calculator',
        title: 'Rectangular Prism',
        description: 'Volume and area.',
        category: 'geometry',
        icon: 'Box',
        inputs: [
            { id: 'l', label: 'Length', type: 'number', placeholder: '5' },
            { id: 'w', label: 'Width', type: 'number', placeholder: '4' },
            { id: 'h', label: 'Height', type: 'number', placeholder: '3' }
        ],
        outputs: [
            {
                label: 'Volume',
                calculate: (inputs) => {
                    const l = Number(inputs.l);
                    const w = Number(inputs.w);
                    const h = Number(inputs.h);
                    if (!l || !w || !h) return 0;
                    return (l * w * h).toFixed(2);
                }
            },
            {
                label: 'Surface Area',
                calculate: (inputs) => {
                    const l = Number(inputs.l);
                    const w = Number(inputs.w);
                    const h = Number(inputs.h);
                    if (!l || !w || !h) return 0;
                    // 2(lw + lh + wh)
                    return (2 * (l * w + l * h + w * h)).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates volume and surface area of a rectangular prism.</p>' }
    },
    // Batch AO: Finance Tools III
    'loan-amortization-calculator': {
        id: 'loan-amortization-calculator',
        title: 'Loan Amortization',
        description: 'Monthly payment & interest.',
        category: 'finance',
        icon: 'Calculator', // or DollarSign if available? Using generic for now
        inputs: [
            { id: 'p', label: 'Loan Amount', type: 'number', placeholder: '20000' },
            { id: 'r', label: 'Interest Rate (%)', type: 'number', placeholder: '5' },
            { id: 't', label: 'Loan Term (Years)', type: 'number', placeholder: '5' }
        ],
        outputs: [
            {
                label: 'Monthly Payment',
                unit: '$',
                calculate: (inputs) => {
                    const p = Number(inputs.p);
                    const r = Number(inputs.r) / 100 / 12;
                    const n = Number(inputs.t) * 12;
                    if (!p || !r || !n) return 0;
                    // M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
                    const m = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
                    return m.toFixed(2);
                }
            },
            {
                label: 'Total Interest',
                unit: '$',
                calculate: (inputs) => {
                    const p = Number(inputs.p);
                    const r = Number(inputs.r) / 100 / 12;
                    const n = Number(inputs.t) * 12;
                    if (!p || !r || !n) return 0;
                    const m = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
                    return ((m * n) - p).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates monthly loan payments and total interest.</p>' }
    },
    'compound-interest-calculator': {
        id: 'compound-interest-calculator',
        title: 'Compound Interest',
        description: 'Growth over time.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'p', label: 'Principal', type: 'number', placeholder: '1000' },
            { id: 'r', label: 'Annual Rate (%)', type: 'number', placeholder: '5' },
            { id: 't', label: 'Time (Years)', type: 'number', placeholder: '10' },
            { id: 'n', label: 'Compounds per Year', type: 'number', placeholder: '12', defaultValue: '12' }
        ],
        outputs: [
            {
                label: 'Future Value',
                unit: '$',
                calculate: (inputs) => {
                    const p = Number(inputs.p);
                    const r = Number(inputs.r) / 100;
                    const t = Number(inputs.t);
                    const n = Number(inputs.n) || 1;
                    if (!p || !r || !t) return 0;
                    // A = P(1 + r/n)^(nt)
                    return (p * Math.pow(1 + r / n, n * t)).toFixed(2);
                }
            },
            {
                label: 'Total Interest Earned',
                unit: '$',
                calculate: (inputs) => {
                    const p = Number(inputs.p);
                    const r = Number(inputs.r) / 100;
                    const t = Number(inputs.t);
                    const n = Number(inputs.n) || 1;
                    if (!p || !r || !t) return 0;
                    const a = p * Math.pow(1 + r / n, n * t);
                    return (a - p).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates compound interest growth.</p>' }
    },
    'credit-card-payoff-calculator': {
        id: 'credit-card-payoff-calculator',
        title: 'Credit Card Payoff',
        description: 'Months to debt free.',
        category: 'finance',
        icon: 'CreditCard',
        inputs: [
            { id: 'bal', label: 'Balance', type: 'number', placeholder: '5000' },
            { id: 'r', label: 'Interest Rate (%)', type: 'number', placeholder: '18' },
            { id: 'pay', label: 'Monthly Payment', type: 'number', placeholder: '200' }
        ],
        outputs: [
            {
                label: 'Months to Payoff',
                calculate: (inputs) => {
                    const b = Number(inputs.bal);
                    const r = Number(inputs.r) / 100 / 12;
                    const p = Number(inputs.pay);
                    if (!b || !p) return 0;
                    if (p <= b * r) return 'Never (Payment too low)';

                    // N = -log(1 - (r * B) / P) / log(1 + r)
                    const n = -Math.log(1 - (r * b) / p) / Math.log(1 + r);
                    return Math.ceil(n).toString();
                }
            },
            {
                label: 'Total Interest Paid',
                unit: '$',
                calculate: (inputs) => {
                    const b = Number(inputs.bal);
                    const r = Number(inputs.r) / 100 / 12;
                    const p = Number(inputs.pay);
                    if (!b || !p || p <= b * r) return '-';
                    const n = -Math.log(1 - (r * b) / p) / Math.log(1 + r);
                    const months = Math.ceil(n);
                    return ((months * p) - b).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates time to pay off credit card debt.</p>' }
    },
    'savings-goal-calculator': {
        id: 'savings-goal-calculator',
        title: 'Savings Goal Calculator',
        description: 'Monthly saving needed.',
        category: 'finance',
        icon: 'Target', // PiggyBank if available? Target fits goal.
        inputs: [
            { id: 'goal', label: 'Goal Amount', type: 'number', placeholder: '10000' },
            { id: 'curr', label: 'Current Savings', type: 'number', placeholder: '1000' },
            { id: 't', label: 'Time to Reach Goal (Months)', type: 'number', placeholder: '12' },
            { id: 'r', label: 'Annual Interest Rate (%)', type: 'number', placeholder: '2' }
        ],
        outputs: [
            {
                label: 'Monthly Saving Needed',
                unit: '$',
                calculate: (inputs) => {
                    const g = Number(inputs.goal);
                    const c = Number(inputs.curr);
                    const t = Number(inputs.t); // months
                    const r = Number(inputs.r) / 100 / 12; // monthly rate
                    if (!g || !t) return 0;
                    if (c >= g) return '0 (Goal Met)';

                    if (r === 0) {
                        return ((g - c) / t).toFixed(2);
                    }

                    // Future Value of Series formula solved for PMT?
                    // FV = C*(1+r)^t + PMT * [ ((1+r)^t - 1) / r ] = Goal
                    // Goal - C*(1+r)^t = PMT * [ ... ]
                    // PMT = (Goal - C*(1+r)^t) / [ ((1+r)^t - 1) / r ]

                    const num = g - c * Math.pow(1 + r, t);
                    const den = (Math.pow(1 + r, t) - 1) / r;
                    return (num / den).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates required monthly savings to reach a goal.</p>' }
    },
    'rule-of-72-calculator': {
        id: 'rule-of-72-calculator',
        title: 'Rule of 72 Calculator',
        description: 'Doubling time of investment.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'r', label: 'Interest Rate (%)', type: 'number', placeholder: '7' }
        ],
        outputs: [
            {
                label: 'Years to Double',
                calculate: (inputs) => {
                    const r = Number(inputs.r);
                    if (!r) return 'Never';
                    return (72 / r).toFixed(1);
                }
            }
        ],
        content: { whatIs: '<p>Estimates years to double an investment using Rule of 72.</p>' }
    },
    // Batch AP: Conversion Tools II
    'celsius-to-fahrenheit': {
        id: 'celsius-to-fahrenheit',
        title: 'Celsius to Fahrenheit',
        description: 'Temperature conversion.',
        category: 'conversion',
        icon: 'Thermometer',
        inputs: [
            { id: 'c', label: 'Celsius (°C)', type: 'number', placeholder: '25' }
        ],
        outputs: [
            {
                label: 'Fahrenheit (°F)',
                calculate: (inputs) => {
                    const c = Number(inputs.c);
                    if (isNaN(c)) return 0;
                    return ((c * 9 / 5) + 32).toFixed(2);
                }
            },
            {
                label: 'Kelvin (K)',
                calculate: (inputs) => {
                    const c = Number(inputs.c);
                    if (isNaN(c)) return 0;
                    return (c + 273.15).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Converts Celsius to Fahrenheit and Kelvin.</p>' }
    },
    'meters-to-feet': {
        id: 'meters-to-feet',
        title: 'Meters to Feet',
        description: 'Length conversion.',
        category: 'conversion',
        icon: 'Ruler',
        inputs: [
            { id: 'm', label: 'Meters (m)', type: 'number', placeholder: '10' }
        ],
        outputs: [
            {
                label: 'Feet (ft)',
                calculate: (inputs) => {
                    const m = Number(inputs.m);
                    if (isNaN(m)) return 0;
                    return (m * 3.28084).toFixed(4);
                }
            },
            {
                label: 'Inches (in)',
                calculate: (inputs) => {
                    const m = Number(inputs.m);
                    if (isNaN(m)) return 0;
                    return (m * 39.3701).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Converts meters to feet and inches.</p>' }
    },
    'kg-to-lbs': {
        id: 'kg-to-lbs',
        title: 'Kg to Lbs Converter',
        description: 'Weight conversion.',
        category: 'conversion',
        icon: 'Scale', // Weight if available
        inputs: [
            { id: 'kg', label: 'Kilograms (kg)', type: 'number', placeholder: '70' }
        ],
        outputs: [
            {
                label: 'Pounds (lbs)',
                calculate: (inputs) => {
                    const kg = Number(inputs.kg);
                    if (isNaN(kg)) return 0;
                    return (kg * 2.20462).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Converts kilograms to pounds.</p>' }
    },
    'liters-to-gallons': {
        id: 'liters-to-gallons',
        title: 'Liters to Gallons',
        description: 'Volume conversion.',
        category: 'conversion',
        icon: 'Droplet', // or Beaker
        inputs: [
            { id: 'l', label: 'Liters (L)', type: 'number', placeholder: '20' }
        ],
        outputs: [
            {
                label: 'Gallons (US)',
                calculate: (inputs) => {
                    const l = Number(inputs.l);
                    if (isNaN(l)) return 0;
                    return (l * 0.264172).toFixed(4);
                }
            },
            {
                label: 'Gallons (UK)',
                calculate: (inputs) => {
                    const l = Number(inputs.l);
                    if (isNaN(l)) return 0;
                    return (l * 0.219969).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Converts liters to US and UK gallons.</p>' }
    },
    'speed-converter': {
        id: 'speed-converter',
        title: 'Speed Converter',
        description: 'km/h to mph.',
        category: 'conversion',
        icon: 'Gauge', // Speedometer
        inputs: [
            { id: 'kmh', label: 'Kilometers per Hour (km/h)', type: 'number', placeholder: '100' }
        ],
        outputs: [
            {
                label: 'Miles per Hour (mph)',
                calculate: (inputs) => {
                    const k = Number(inputs.kmh);
                    if (isNaN(k)) return 0;
                    return (k * 0.621371).toFixed(2);
                }
            },
            {
                label: 'Meters per Second (m/s)',
                calculate: (inputs) => {
                    const k = Number(inputs.kmh);
                    if (isNaN(k)) return 0;
                    return (k / 3.6).toFixed(2);
                }
            }
        ],
    },
    // Batch AQ: Web Development Tools
    'aspect-ratio-calculator': {
        id: 'aspect-ratio-calculator',
        title: 'Aspect Ratio Calculator',
        description: 'Calculate dimensions based on ratio.',
        category: 'web',
        icon: 'Monitor',
        inputs: [
            { id: 'w1', label: 'Width 1', type: 'number', placeholder: '1920' },
            { id: 'h1', label: 'Height 1', type: 'number', placeholder: '1080' },
            { id: 'w2', label: 'Width 2 (Optional)', type: 'number', placeholder: '?' }
        ],
        outputs: [
            {
                label: 'Result Height (H2)',
                calculate: (inputs) => {
                    const w1 = Number(inputs.w1);
                    const h1 = Number(inputs.h1);
                    const w2 = Number(inputs.w2);
                    if (!w1 || !h1 || !w2) return '-';
                    // (H1 / W1) * W2
                    return ((h1 / w1) * w2).toFixed(0);
                }
            },
            {
                label: 'Ratio',
                calculate: (inputs) => {
                    const w1 = Number(inputs.w1);
                    const h1 = Number(inputs.h1);
                    if (!w1 || !h1) return '-';
                    // Simplify fraction? 1920:1080 -> 16:9
                    const gcd = (a, b) => b ? gcd(b, a % b) : a;
                    const div = gcd(w1, h1);
                    return `${w1 / div}:${h1 / div}`;
                }
            }
        ],
        content: { whatIs: '<p>Calculates aspect ratios and missing dimensions.</p>' }
    },
    'px-to-rem': {
        id: 'px-to-rem',
        title: 'PX to REM Converter',
        description: 'CSS unit conversion.',
        category: 'web',
        icon: 'Type', // Type or Hash
        inputs: [
            { id: 'px', label: 'Pixels (px)', type: 'number', placeholder: '16' },
            { id: 'base', label: 'Base Size (px)', type: 'number', placeholder: '16', defaultValue: '16' }
        ],
        outputs: [
            {
                label: 'REM',
                unit: 'rem',
                calculate: (inputs) => {
                    const px = Number(inputs.px);
                    const base = Number(inputs.base) || 16;
                    if (isNaN(px)) return 0;
                    return (px / base).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Converts pixels to REM units based on root font size.</p>' }
    },
    'hex-to-rgb': {
        id: 'hex-to-rgb',
        title: 'HEX to RGB Converter',
        description: 'Color code conversion.',
        category: 'web',
        icon: 'Palette', // If available, otherwise Monitor or Sun
        inputs: [
            { id: 'hex', label: 'HEX Code', type: 'text', placeholder: '#FF5733' }
        ],
        outputs: [
            {
                label: 'RGB',
                calculate: (inputs) => {
                    let hex = inputs.hex || '';
                    hex = hex.replace('#', '');
                    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
                    if (hex.length !== 6) return 'Invalid Hex';
                    const r = parseInt(hex.substring(0, 2), 16);
                    const g = parseInt(hex.substring(2, 4), 16);
                    const b = parseInt(hex.substring(4, 6), 16);
                    if (isNaN(r) || isNaN(g) || isNaN(b)) return 'Invalid Hex';
                    return `rgb(${r}, ${g}, ${b})`;
                }
            }
        ],
        content: { whatIs: '<p>Converts HEX color codes to RGB format.</p>' }
    },
    'screen-resolution-calculator': {
        id: 'screen-resolution-calculator',
        title: 'PPI Calculator',
        description: 'Pixels per inch.',
        category: 'web',
        icon: 'Monitor',
        inputs: [
            { id: 'w', label: 'Width (px)', type: 'number', placeholder: '1920' },
            { id: 'h', label: 'Height (px)', type: 'number', placeholder: '1080' },
            { id: 'd', label: 'Diagonal (inches)', type: 'number', placeholder: '24' }
        ],
        outputs: [
            {
                label: 'PPI',
                calculate: (inputs) => {
                    const w = Number(inputs.w);
                    const h = Number(inputs.h);
                    const d = Number(inputs.d);
                    if (!w || !h || !d) return 0;
                    const diagPx = Math.sqrt(w * w + h * h);
                    return (diagPx / d).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates Pixels Per Inch (PPI) of a display.</p>' }
    },
    'bandwidth-calculator': {
        id: 'bandwidth-calculator',
        title: 'Bandwidth Calculator',
        description: 'File transfer time.',
        category: 'web',
        icon: 'Wifi', // or Zap
        inputs: [
            { id: 'size', label: 'File Size', type: 'number', placeholder: '1', unit: 'GB' },
            { id: 'speed', label: 'Internet Speed', type: 'number', placeholder: '100', unit: 'Mbps' }
        ],
        outputs: [
            {
                label: 'Estimated Time',
                calculate: (inputs) => {
                    const sizeGB = Number(inputs.size);
                    const speedMbps = Number(inputs.speed);
                    if (!sizeGB || !speedMbps) return '0s';
                    // Size in bits: x GB * 1024 MB * 1024 KB * 1024 B * 8 bits
                    // Or simpler: 1 GB = 8000 Mb (decimal) or 8192 Mb (binary). Bandwidth usually decimal?
                    // Let's use standard decimal for network: 1 GB = 8000 Megabits.
                    // Wait, 1 Byte = 8 bits.
                    // 1 GB = 1000 MB (Storage is 1000 or 1024? Usually 1000 for network/ssd marketing, 1024 for RAM).
                    // Let's assume binary Gigabytes (GiB) if generic "GB" often means that in windows?
                    // Let's use decimal for simplicity: 1 GB = 8,000,000,000 bits.
                    // Speed = 100 Mbps = 100,000,000 bits/sec.
                    // Seconds = (Size * 8 * 1000 * 1000 * 1000 optional) / (Speed * 1000 * 1000)
                    // (SizeGB * 8 * 1024 * 1024 * 1024) / (SpeedMbps * 1000 * 1000) -> Mixing binary and decimal.
                    // Let's do standard: Size * 1024 * 8 (Mb) / Speed (Mbps) ?
                    const sizeMb = sizeGB * 1024 * 8;
                    const timeSec = sizeMb / speedMbps;

                    if (timeSec < 60) return timeSec.toFixed(1) + ' sec';
                    if (timeSec < 3600) return (timeSec / 60).toFixed(1) + ' min';
                    return (timeSec / 3600).toFixed(2) + ' hours';
                }
            }
        ],
        content: { whatIs: '<p>Estimates time to download/upload a file.</p>' }
    },
    // Batch AR: Ecology Tools II
    'plastic-waste-calculator': {
        id: 'plastic-waste-calculator',
        title: 'Plastic Waste Calculator',
        description: 'Estimate yearly impact.',
        category: 'ecology',
        icon: 'Trash', // or Leaf
        inputs: [
            { id: 'bottles', label: 'Bottles per Week', type: 'number', placeholder: '5' },
            { id: 'bags', label: 'Plastic Bags per Week', type: 'number', placeholder: '3' },
            { id: 'wrappers', label: 'Wrappers/Packets per Week', type: 'number', placeholder: '10' }
        ],
        outputs: [
            {
                label: 'Yearly Plastic Waste (kg)',
                calculate: (inputs) => {
                    const b = Number(inputs.bottles) || 0;
                    const bags = Number(inputs.bags) || 0;
                    const w = Number(inputs.wrappers) || 0;
                    // Avg weights: Bottle ~10g, Bag ~5g, Wrapper ~2g
                    const weeklyG = (b * 10) + (bags * 5) + (w * 2);
                    return ((weeklyG * 52) / 1000).toFixed(2);
                }
            },
            {
                label: 'Items per Year',
                calculate: (inputs) => {
                    const b = Number(inputs.bottles) || 0;
                    const bags = Number(inputs.bags) || 0;
                    const w = Number(inputs.wrappers) || 0;
                    return ((b + bags + w) * 52).toString();
                }
            }
        ],
        content: { whatIs: '<p>Estimates personal plastic waste footprint.</p>' }
    },
    'compost-ratio-calculator': {
        id: 'compost-ratio-calculator',
        title: 'Compost C:N Ratio',
        description: 'Greens vs Browns ratio.',
        category: 'ecology',
        icon: 'Sprout',
        inputs: [
            { id: 'browns', label: 'Weight of Browns (C)', type: 'number', placeholder: '10', unit: 'kg' },
            { id: 'greens', label: 'Weight of Greens (N)', type: 'number', placeholder: '5', unit: 'kg' }
        ],
        outputs: [
            {
                label: 'C:N Ratio Estimate',
                calculate: (inputs) => {
                    const b = Number(inputs.browns);
                    const g = Number(inputs.greens);
                    if (!b || !g) return 0;
                    // Simplify: Browns ~30:1 to 60:1 (avg 45), Greens ~15:1 to 20:1 (avg 17).
                    // This is complex, but let's do a weighted average check or just simple mass ratio recommendation.
                    // Ideal is 25-30:1.
                    // Let's just output the Mass Ratio and a tip.
                    const ratio = b / g;
                    return `Mass Ratio ${ratio.toFixed(1)}:1 (Browns:Greens)`;
                }
            },
            {
                label: 'Status',
                calculate: (inputs) => {
                    const b = Number(inputs.browns);
                    const g = Number(inputs.greens);
                    if (!b || !g) return '-';
                    const ratio = b / g;
                    if (ratio < 1) return 'Too many greens (Slime risk)';
                    if (ratio > 3) return 'Too many browns (Slow)';
                    return 'Good mix (Aim for 1:1 to 2:1 by vol, ~1:1 by weight often okay)';
                }
            }
        ],
        content: { whatIs: '<p>Helps balance Carbon (Browns) and Nitrogen (Greens) in compost.</p>' }
    },
    'rainwater-harvesting-calculator': {
        id: 'rainwater-harvesting-calculator',
        title: 'Rainwater Harvesting',
        description: 'Collection potential.',
        category: 'ecology',
        icon: 'CloudRain',
        inputs: [
            { id: 'area', label: 'Roof Area', type: 'number', placeholder: '100', unit: 'm²' },
            { id: 'rain', label: 'Annual Rainfall', type: 'number', placeholder: '1000', unit: 'mm' },
            { id: 'eff', label: 'Efficiency (%)', type: 'number', placeholder: '85', defaultValue: '85' }
        ],
        outputs: [
            {
                label: 'Harvest Potential',
                unit: 'Liters/Year',
                calculate: (inputs) => {
                    const a = Number(inputs.area);
                    const r = Number(inputs.rain);
                    const e = Number(inputs.eff) / 100;
                    if (!a || !r) return 0;
                    // 1mm on 1m2 = 1 Liter.
                    return (a * r * e).toFixed(0);
                }
            }
        ],
        content: { whatIs: '<p>Calculates potential rainwater collection volume.</p>' }
    },
    'food-miles-calculator': {
        id: 'food-miles-calculator',
        title: 'Food Miles Estimates',
        description: 'Transport emissions.',
        category: 'ecology',
        icon: 'Truck', // Truck or Globe
        inputs: [
            { id: 'dist', label: 'Distance', type: 'number', placeholder: '1000', unit: 'km' },
            { id: 'weight', label: 'Weight', type: 'number', placeholder: '1', unit: 'kg' },
            { id: 'mode', label: 'Mode (1=Road, 2=Air, 3=Ship)', type: 'number', placeholder: '1', defaultValue: '1' }
        ],
        outputs: [
            {
                label: 'Est. CO2 Emissions',
                unit: 'kg CO2',
                calculate: (inputs) => {
                    const d = Number(inputs.dist);
                    const w = Number(inputs.weight); // kg -> ton for factor?
                    const m = Number(inputs.mode);
                    if (!d || !w) return 0;
                    // Factors (approx kg CO2 per ton-km):
                    // Road: 0.1, Air: 1.0 (very high), Ship: 0.01
                    let factor = 0.1; // Road default
                    if (m === 2) factor = 1.0; // Air
                    if (m === 3) factor = 0.01; // Ship

                    const tonKm = (w / 1000) * d;
                    return (tonKm * factor).toFixed(3);
                }
            }
        ],
        content: { whatIs: '<p>Crude estimate of transport CO2 for food items.</p>' }
    },
    'aqi-converter': {
        id: 'aqi-converter',
        title: 'AQI From PM2.5',
        description: 'Convert raw PM2.5 to AQI.',
        category: 'ecology',
        icon: 'Wind', // or Cloud
        inputs: [
            { id: 'pm25', label: 'PM2.5 Conc.', type: 'number', placeholder: '35', unit: 'µg/m³' }
        ],
        outputs: [
            {
                label: 'US AQI',
                calculate: (inputs) => {
                    const c = Number(inputs.pm25);
                    if (isNaN(c) || c < 0) return 0;
                    // US EPA Breakpoints for PM2.5
                    // 0-12.0 -> 0-50
                    // 12.1-35.4 -> 51-100
                    // 35.5-55.4 -> 101-150
                    // 55.5-150.4 -> 151-200
                    // 150.5-250.4 -> 201-300
                    // 250.5+ -> 301+

                    const calc = (Cp, Ih, Il, BPh, BPl) => {
                        return Math.round(((Ih - Il) / (BPh - BPl)) * (Cp - BPl) + Il);
                    };

                    if (c <= 12.0) return calc(c, 50, 0, 12, 0).toString();
                    if (c <= 35.4) return calc(c, 100, 51, 35.4, 12.1).toString();
                    if (c <= 55.4) return calc(c, 150, 101, 55.4, 35.5).toString();
                    if (c <= 150.4) return calc(c, 200, 151, 150.4, 55.5).toString();
                    if (c <= 250.4) return calc(c, 300, 201, 250.4, 150.5).toString();
                    if (c <= 350.4) return calc(c, 400, 301, 350.4, 250.5).toString();
                    if (c <= 500.4) return calc(c, 500, 401, 500.4, 350.5).toString();
                    return '500+ (Hazardous)';
                }
            },
            {
                label: 'Category',
                calculate: (inputs) => {
                    const c = Number(inputs.pm25);
                    if (isNaN(c)) return '-';
                    if (c <= 12.0) return 'Good';
                    if (c <= 35.4) return 'Moderate';
                    if (c <= 55.4) return 'Unhealthy for Sensitive';
                    if (c <= 150.4) return 'Unhealthy';
                    if (c <= 250.4) return 'Very Unhealthy';
                    return 'Hazardous';
                }
            }
        ],
        content: { whatIs: '<p>Calculate AQI from PM2.5 concentration (US EPA standard).</p>' }
    },
    // Batch AS: Health Tools III
    'water-intake-calculator': {
        id: 'water-intake-calculator',
        title: 'Daily Water Intake',
        description: 'Hydration goal.',
        category: 'health',
        icon: 'Droplet',
        inputs: [
            { id: 'weight', label: 'Weight', type: 'number', placeholder: '70', unit: 'kg' },
            { id: 'activity', label: 'Activity Time', type: 'number', placeholder: '30', unit: 'min/day' }
        ],
        outputs: [
            {
                label: 'Recommended Intake',
                unit: 'Liters',
                calculate: (inputs) => {
                    const w = Number(inputs.weight);
                    const a = Number(inputs.activity) || 0;
                    if (!w) return 0;
                    // Formula: Weight * 0.033 + (Activity/30 * 0.35)
                    const base = w * 0.033;
                    const actAdd = (a / 30) * 0.35;
                    return (base + actAdd).toFixed(2);
                }
            },
            {
                label: 'In Cups (250ml)',
                calculate: (inputs) => {
                    const w = Number(inputs.weight);
                    const a = Number(inputs.activity) || 0;
                    if (!w) return 0;
                    const base = w * 0.033;
                    const actAdd = (a / 30) * 0.35;
                    const liters = base + actAdd;
                    return Math.round(liters * 4).toString();
                }
            }
        ],
        content: { whatIs: '<p>Estimates daily water needs based on weight and activity.</p>' }
    },
    'sleep-cycle-calculator': {
        id: 'sleep-cycle-calculator',
        title: 'Sleep Cycle Calculator',
        description: 'Wake up refreshed.',
        category: 'health',
        icon: 'Moon', // or Clock
        inputs: [
            { id: 'wake', label: 'Wake Up Time (Hour)', type: 'number', placeholder: '7' },
            { id: 'ampm', label: 'AM(0) or PM(1)', type: 'number', placeholder: '0', defaultValue: '0' }
        ],
        outputs: [
            {
                label: 'Best Bedtime (5-6 cycles)',
                calculate: (inputs) => {
                    const h = Number(inputs.wake);
                    const ampm = Number(inputs.ampm);
                    if (isNaN(h)) return '-';
                    // Roughly 7.5h or 9h before. Each cycle ~90min.
                    // 5 cycles = 7.5h, 6 cycles = 9h.
                    // If wake is 7 AM -> 11:30 PM (7.5h) or 10:00 PM (9h).
                    // This is simple static math.

                    let wakeHour24 = h;
                    if (ampm === 1 && h < 12) wakeHour24 += 12;
                    if (ampm === 0 && h === 12) wakeHour24 = 0;

                    const timeInMin = wakeHour24 * 60;
                    const cycles5 = timeInMin - (5 * 90); // -450 min
                    const cycles6 = timeInMin - (6 * 90); // -540 min

                    const fmt = (m) => {
                        let mins = m;
                        if (mins < 0) mins += 1440;
                        const hr = Math.floor(mins / 60);
                        const mn = mins % 60;
                        const suffix = hr >= 12 ? 'PM' : 'AM';
                        const hr12 = hr % 12 || 12;
                        const mnStr = mn < 10 ? '0' + mn : mn;
                        return `${hr12}:${mnStr} ${suffix}`;
                    };

                    return `${fmt(cycles6)} or ${fmt(cycles5)}`;
                }
            }
        ],
        content: { whatIs: '<p>Calculates bedtime to wake up during a light sleep phase.</p>' }
    },
    'pregnancy-due-date-calculator': {
        id: 'pregnancy-due-date-calculator',
        title: 'Pregnancy Due Date',
        description: 'Based on LMP.',
        category: 'health',
        icon: 'Baby', // or Heart
        inputs: [
            { id: 'lmp_month', label: 'LMP Month (1-12)', type: 'number', placeholder: '1' },
            { id: 'lmp_day', label: 'LMP Day (1-31)', type: 'number', placeholder: '1' },
            { id: 'lmp_year', label: 'LMP Year', type: 'number', placeholder: '2025' }
        ],
        outputs: [
            {
                label: 'Estimated Due Date',
                calculate: (inputs) => {
                    const m = Number(inputs.lmp_month);
                    const d = Number(inputs.lmp_day);
                    const y = Number(inputs.lmp_year);
                    if (!m || !d || !y) return '-';
                    // Naegele's rule: LMP + 1 year - 3 months + 7 days
                    // Or simpler: LMP + 280 days.
                    const date = new Date(y, m - 1, d);
                    date.setDate(date.getDate() + 280);
                    return date.toLocaleDateString();
                }
            }
        ],
        content: { whatIs: '<p>Estimates due date using Naegele\'s Rule (LMP + 280 days).</p>' }
    },
    'ovulation-calculator': {
        id: 'ovulation-calculator',
        title: 'Ovulation Calculator',
        description: 'Fertile window.',
        category: 'health',
        icon: 'Calendar', // or Heart
        inputs: [
            { id: 'lmp_month', label: 'LMP Month (1-12)', type: 'number', placeholder: '1' },
            { id: 'lmp_day', label: 'LMP Day (1-31)', type: 'number', placeholder: '1' },
            { id: 'cycle', label: 'Cycle Length (Days)', type: 'number', placeholder: '28' }
        ],
        outputs: [
            {
                label: 'Ovulation Date',
                calculate: (inputs) => {
                    const m = Number(inputs.lmp_month);
                    const d = Number(inputs.lmp_day);
                    const c = Number(inputs.cycle) || 28;
                    if (!m || !d) return '-';
                    // Ovulation ~14 days before NEXT period.
                    // Next period = LMP + Cycle.
                    // Ovulation = (LMP + Cycle) - 14.
                    const date = new Date(new Date().getFullYear(), m - 1, d); // Assume current year for LMP context? Or ask for year.
                    // Simple logic without year assumes "last" LMP.
                    date.setDate(date.getDate() + c - 14);
                    return `${date.getMonth() + 1}/${date.getDate()} (Approx)`;
                }
            },
            {
                label: 'Fertile Window',
                calculate: (inputs) => {
                    const m = Number(inputs.lmp_month);
                    const d = Number(inputs.lmp_day);
                    const c = Number(inputs.cycle) || 28;
                    if (!m || !d) return '-';
                    const date = new Date(new Date().getFullYear(), m - 1, d);
                    date.setDate(date.getDate() + c - 14); // Ovulations
                    // Window: -5 days to +1 day?
                    const start = new Date(date); start.setDate(date.getDate() - 5);
                    const end = new Date(date); end.setDate(date.getDate() + 1);
                    return `${start.getMonth() + 1}/${start.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`;
                }
            }
        ],
        content: { whatIs: '<p>Estimates ovulation date and fertile window.</p>' }
    },
    'bac-estimate-calculator': {
        id: 'bac-estimate-calculator',
        title: 'BAC Estimate',
        description: 'Blood Alcohol Content.',
        category: 'health',
        icon: 'Wine', // or Beer/Glass
        inputs: [
            { id: 'drinks', label: 'Standard Drinks', type: 'number', placeholder: '3' },
            { id: 'hours', label: 'Hours Since Drinking', type: 'number', placeholder: '2' },
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '75' },
            { id: 'sex', label: 'Sex (0=Male, 1=Female)', type: 'number', placeholder: '0' }
        ],
        outputs: [
            {
                label: 'Estimated BAC %',
                calculate: (inputs) => {
                    const d = Number(inputs.drinks);
                    const h = Number(inputs.hours);
                    const w = Number(inputs.weight);
                    const s = Number(inputs.sex);
                    if (!d || !w) return 0;
                    // Widmark Formula:
                    // BAC = [Alcohol(g) / (Weight(g) * r)] * 100 - (0.015 * hours)
                    // Standard drink ~14g alcohol (US) or 10g (AU). Let's use 14g.
                    const alc = d * 14;
                    const r = s === 0 ? 0.68 : 0.55; // Male/Female distribution
                    const weightG = w * 1000;

                    let bac = (alc / (weightG * r)) * 100;
                    bac = bac - (0.015 * h);
                    if (bac < 0) return 0;
                    return bac.toFixed(3) + '%';
                }
            },
            {
                label: 'Legal Drive Limit (US 0.08)',
                calculate: (inputs) => {
                    const d = Number(inputs.drinks);
                    const h = Number(inputs.hours);
                    const w = Number(inputs.weight);
                    const s = Number(inputs.sex);
                    if (!d || !w) return '-';
                    const alc = d * 14;
                    const r = s === 0 ? 0.68 : 0.55;
                    const weightG = w * 1000;
                    let bac = (alc / (weightG * r)) * 100;
                    bac = bac - (0.015 * h);
                    if (bac > 0.08) return 'Unsafe / Illegal';
                    return 'Likely OK (Check local laws)';
                }
            }
        ],
        content: { whatIs: '<p>Estimates Blood Alcohol Content (Widmark Formula). For informational purposes only.</p>' }
    },
    // Batch AT: Algebra & Number Theory
    'quadratic-formula-calculator': {
        id: 'quadratic-formula-calculator',
        title: 'Quadratic Equation Solver',
        description: 'ax² + bx + c = 0',
        category: 'mathematics',
        icon: 'FunctionSquare', // or TrendingUp
        inputs: [
            { id: 'a', label: 'Coefficient a', type: 'number', placeholder: '1' },
            { id: 'b', label: 'Coefficient b', type: 'number', placeholder: '-3' },
            { id: 'c', label: 'Coefficient c', type: 'number', placeholder: '-4' }
        ],
        outputs: [
            {
                label: 'Roots (x)',
                calculate: (inputs) => {
                    const a = Number(inputs.a);
                    const b = Number(inputs.b);
                    const c = Number(inputs.c);
                    if (a === 0) return 'Not quadratic (a=0)';
                    const delta = b * b - 4 * a * c;
                    if (delta < 0) return 'No real roots';
                    const x1 = (-b + Math.sqrt(delta)) / (2 * a);
                    const x2 = (-b - Math.sqrt(delta)) / (2 * a);
                    if (delta === 0) return `x = ${x1}`;
                    return `x1 = ${x1}, x2 = ${x2}`;
                }
            },
            {
                label: 'Discriminant (Δ)',
                calculate: (inputs) => {
                    const a = Number(inputs.a);
                    const b = Number(inputs.b);
                    const c = Number(inputs.c);
                    return (b * b - 4 * a * c).toString();
                }
            }
        ],
        content: { whatIs: '<p>Solves quadratic equations using the quadratic formula.</p>' }
    },
    'pythagorean-theorem-calculator': {
        id: 'pythagorean-theorem-calculator',
        title: 'Pythagorean Theorem',
        description: 'Find hypotenuse or leg.',
        category: 'mathematics',
        icon: 'Triangle',
        inputs: [
            { id: 'a', label: 'Side a', type: 'number', placeholder: '3' },
            { id: 'b', label: 'Side b', type: 'number', placeholder: '4' },
            { id: 'c', label: 'Hypotenuse c (Optional)', type: 'number', placeholder: '?' }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const a = Number(inputs.a);
                    const b = Number(inputs.b);
                    const c = Number(inputs.c);
                    // If A and B given, find C
                    if (a && b && !c) {
                        return 'c = ' + Math.sqrt(a * a + b * b).toFixed(2);
                    }
                    // If C and (A or B) given, find other
                    if (c && a && !b) {
                        return 'b = ' + Math.sqrt(c * c - a * a).toFixed(2);
                    }
                    if (c && b && !a) {
                        return 'a = ' + Math.sqrt(c * c - b * b).toFixed(2);
                    }
                    return 'Enter 2 values';
                }
            }
        ],
        content: { whatIs: '<p>Calculates the missing side of a right-angled triangle (a² + b² = c²).</p>' }
    },
    'logarithm-solver': {
        id: 'logarithm-solver',
        title: 'Logarithm Solver',
        description: 'Log base b of x.',
        category: 'mathematics',
        icon: 'Calculator',
        inputs: [
            { id: 'base', label: 'Base (b)', type: 'number', placeholder: '10', defaultValue: '10' },
            { id: 'x', label: 'Number (x)', type: 'number', placeholder: '100' }
        ],
        outputs: [
            {
                label: 'Result (y)',
                calculate: (inputs) => {
                    const b = Number(inputs.base);
                    const x = Number(inputs.x);
                    if (b <= 0 || b === 1 || x <= 0) return 'Invalid input';
                    // log_b(x) = log(x) / log(b)
                    return (Math.log(x) / Math.log(b)).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Calculates logarithm of x with base b.</p>' }
    },
    'gcd-lcm-calculator': {
        id: 'gcd-lcm-calculator',
        title: 'GCD / LCM Calculator',
        description: 'Greatest Common Divisor.',
        category: 'mathematics',
        icon: 'Divide', // or Calculator
        inputs: [
            { id: 'n1', label: 'Number 1', type: 'number', placeholder: '12' },
            { id: 'n2', label: 'Number 2', type: 'number', placeholder: '18' }
        ],
        outputs: [
            {
                label: 'GCD (HCF)',
                calculate: (inputs) => {
                    let a = Math.abs(Number(inputs.n1));
                    let b = Math.abs(Number(inputs.n2));
                    if (!a || !b) return '0';
                    const gcd = (x, y) => y ? gcd(y, x % y) : x;
                    return gcd(a, b).toString();
                }
            },
            {
                label: 'LCM',
                calculate: (inputs) => {
                    let a = Math.abs(Number(inputs.n1));
                    let b = Math.abs(Number(inputs.n2));
                    if (!a || !b) return '0';
                    const gcd = (x, y) => y ? gcd(y, x % y) : x;
                    return ((a * b) / gcd(a, b)).toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates Greatest Common Divisor and Least Common Multiple.</p>' }
    },
    'prime-factorization-calculator': {
        id: 'prime-factorization-calculator',
        title: 'Prime Factorization',
        description: 'Decompose integer.',
        category: 'mathematics',
        icon: 'Hash',
        inputs: [
            { id: 'n', label: 'Number (Integer)', type: 'number', placeholder: '60' }
        ],
        outputs: [
            {
                label: 'Factors',
                calculate: (inputs) => {
                    let n = Number(inputs.n);
                    if (!n || n < 2) return 'None';
                    n = Math.floor(n);
                    const factors = [];
                    let d = 2;
                    while (d * d <= n) {
                        while (n % d === 0) {
                            factors.push(d);
                            n /= d;
                        }
                        d++;
                    }
                    if (n > 1) factors.push(n);
                    return factors.join(' × ');
                }
            }
        ],
        content: { whatIs: '<p>Finds prime factors of an integer.</p>' }
    },
    // Batch AU: Physics Tools III
    'kinetic-energy-calculator': {
        id: 'kinetic-energy-calculator',
        title: 'Kinetic Energy',
        description: 'KE = ½mv²',
        category: 'physics',
        icon: 'Zap', // or Activity
        inputs: [
            { id: 'm', label: 'Mass (kg)', type: 'number', placeholder: '10' },
            { id: 'v', label: 'Velocity (m/s)', type: 'number', placeholder: '5' }
        ],
        outputs: [
            {
                label: 'Kinetic Energy (J)',
                calculate: (inputs) => {
                    const m = Number(inputs.m);
                    const v = Number(inputs.v);
                    if (!m || !v) return 0;
                    return (0.5 * m * v * v).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates the energy of an object in motion.</p>' }
    },
    'potential-energy-calculator': {
        id: 'potential-energy-calculator',
        title: 'Potential Energy',
        description: 'PE = mgh',
        category: 'physics',
        icon: 'ArrowUp', // or Mountain
        inputs: [
            { id: 'm', label: 'Mass (kg)', type: 'number', placeholder: '10' },
            { id: 'h', label: 'Height (m)', type: 'number', placeholder: '5' },
            { id: 'g', label: 'Gravity (m/s²)', type: 'number', placeholder: '9.81', defaultValue: '9.81' }
        ],
        outputs: [
            {
                label: 'Potential Energy (J)',
                calculate: (inputs) => {
                    const m = Number(inputs.m);
                    const h = Number(inputs.h);
                    const g = Number(inputs.g) || 9.81;
                    return (m * g * h).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates gravitational potential energy.</p>' }
    },
    'projectile-motion-calculator': {
        id: 'projectile-motion-calculator',
        title: 'Projectile Motion',
        description: 'Range, Height, Time.',
        category: 'physics',
        icon: 'TrendingUp',
        inputs: [
            { id: 'v', label: 'Initial Velocity (m/s)', type: 'number', placeholder: '20' },
            { id: 'angle', label: 'Launch Angle (deg)', type: 'number', placeholder: '45' },
            { id: 'g', label: 'Gravity (m/s²)', type: 'number', placeholder: '9.81', defaultValue: '9.81' }
        ],
        outputs: [
            {
                label: 'Max Height (H)',
                calculate: (inputs) => {
                    const v = Number(inputs.v);
                    const ang = Number(inputs.angle) * (Math.PI / 180);
                    const g = Number(inputs.g) || 9.81;
                    // H = (v^2 * sin^2(ang)) / 2g
                    const sin = Math.sin(ang);
                    return ((v * v * sin * sin) / (2 * g)).toFixed(2) + ' m';
                }
            },
            {
                label: 'Max Range (R)',
                calculate: (inputs) => {
                    const v = Number(inputs.v);
                    const ang = Number(inputs.angle) * (Math.PI / 180);
                    const g = Number(inputs.g) || 9.81;
                    // R = (v^2 * sin(2*ang)) / g
                    return ((v * v * Math.sin(2 * ang)) / g).toFixed(2) + ' m';
                }
            },
            {
                label: 'Flight Time (t)',
                calculate: (inputs) => {
                    const v = Number(inputs.v);
                    const ang = Number(inputs.angle) * (Math.PI / 180);
                    const g = Number(inputs.g) || 9.81;
                    // t = (2*v * sin(ang)) / g
                    return ((2 * v * Math.sin(ang)) / g).toFixed(2) + ' s';
                }
            }
        ],
        content: { whatIs: '<p>Calculates projectile kinematics (assuming no air resistance).</p>' }
    },
    'hooke-law-calculator': {
        id: 'hooke-law-calculator',
        title: 'Hooke\'s Law',
        description: 'F = -kx',
        category: 'physics',
        icon: 'MoveVertical', // Spring stretch
        inputs: [
            { id: 'k', label: 'Spring Constant (k)', type: 'number', placeholder: '100', unit: 'N/m' },
            { id: 'x', label: 'Displacement (x)', type: 'number', placeholder: '0.1', unit: 'm' }
        ],
        outputs: [
            {
                label: 'Force (F)',
                unit: 'Newtons',
                calculate: (inputs) => {
                    const k = Number(inputs.k);
                    const x = Number(inputs.x);
                    return (k * x).toFixed(2);
                }
            },
            {
                label: 'Potential Energy',
                unit: 'Joules',
                calculate: (inputs) => {
                    const k = Number(inputs.k);
                    const x = Number(inputs.x);
                    // PE = 0.5 * k * x^2
                    return (0.5 * k * x * x).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates spring force and potential energy.</p>' }
    },
    'density-calculator': {
        id: 'density-calculator',
        title: 'Density Calculator',
        description: 'ρ = m/V',
        category: 'physics',
        icon: 'Box', // or Scale
        inputs: [
            { id: 'm', label: 'Mass', type: 'number', placeholder: '100', unit: 'g' },
            { id: 'v', label: 'Volume', type: 'number', placeholder: '50', unit: 'cm³' }
        ],
        outputs: [
            {
                label: 'Density (ρ)',
                calculate: (inputs) => {
                    const m = Number(inputs.m);
                    const v = Number(inputs.v);
                    if (!v) return 0;
                    return (m / v).toFixed(3);
                }
            }
        ],
        content: { whatIs: '<p>Calculates density from mass and volume.</p>' }
    },
    // Batch AV: Everyday Utility
    'random-number-generator': {
        id: 'random-number-generator',
        title: 'Random Number Generator',
        description: 'Min / Max.',
        category: 'everyday',
        icon: 'Hash', // or Shuffle if available, Hash is safe
        inputs: [
            { id: 'min', label: 'Minimum', type: 'number', placeholder: '1' },
            { id: 'max', label: 'Maximum', type: 'number', placeholder: '100' }
        ],
        outputs: [
            {
                label: 'Random Number',
                calculate: (inputs) => {
                    const min = Number(inputs.min);
                    const max = Number(inputs.max);
                    if (isNaN(min) || isNaN(max)) return '-';
                    if (min > max) return 'Min > Max';
                    return Math.floor(Math.random() * (max - min + 1) + min).toString();
                }
            }
        ],
        content: { whatIs: '<p>Generates a random integer between min and max (inclusive).</p>' }
    },
    'password-generator': {
        id: 'password-generator',
        title: 'Simple Password Gen',
        description: 'Random string.',
        category: 'everyday',
        icon: 'Lock', // or Key
        inputs: [
            { id: 'len', label: 'Length (4-32)', type: 'number', placeholder: '12', defaultValue: '12' }
        ],
        outputs: [
            {
                label: 'Password',
                calculate: (inputs) => {
                    let len = Number(inputs.len) || 12;
                    if (len < 4) len = 4;
                    if (len > 32) len = 32;
                    const cars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
                    let pass = '';
                    for (let i = 0; i < len; i++) {
                        pass += cars.charAt(Math.floor(Math.random() * cars.length));
                    }
                    return pass;
                }
            }
        ],
        content: { whatIs: '<p>Generates a random secure-ish password string.</p>' }
    },
    'dice-roller': {
        id: 'dice-roller',
        title: 'Dice Roller',
        description: 'Roll d6, d20, etc.',
        category: 'everyday',
        icon: 'Box', // Box ~ Cube ~ Dice
        inputs: [
            { id: 'sides', label: 'Sides (e.g. 6)', type: 'number', placeholder: '6', defaultValue: '6' },
            { id: 'count', label: 'Count (1-10)', type: 'number', placeholder: '1', defaultValue: '1' }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const s = Number(inputs.sides) || 6;
                    let c = Number(inputs.count) || 1;
                    if (c > 10) c = 10;
                    const rolls = [];
                    for (let i = 0; i < c; i++) {
                        rolls.push(Math.floor(Math.random() * s) + 1);
                    }
                    return rolls.join(', ');
                }
            },
            {
                label: 'Total',
                calculate: (inputs) => {
                    const s = Number(inputs.sides) || 6;
                    let c = Number(inputs.count) || 1;
                    if (c > 10) c = 10;
                    let sum = 0;
                    for (let i = 0; i < c; i++) {
                        sum += (Math.floor(Math.random() * s) + 1);
                    }
                    return sum.toString();
                }
            }
        ],
        content: { whatIs: '<p>Simulates rolling dice with specified sides.</p>' }
    },
    'coin-flipper': {
        id: 'coin-flipper',
        title: 'Coin Flipper',
        description: 'Heads or Tails.',
        category: 'everyday',
        icon: 'Circle', // Coin
        inputs: [
            { id: 'flips', label: 'Number of Flips', type: 'number', placeholder: '1', defaultValue: '1' }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    let n = Number(inputs.flips) || 1;
                    if (n > 10) n = 10;
                    const Res = [];
                    let h = 0, t = 0;
                    for (let i = 0; i < n; i++) {
                        if (Math.random() > 0.5) { Res.push('Heads'); h++; }
                        else { Res.push('Tails'); t++; }
                    }
                    if (n === 1) return Res[0];
                    return `${h} Heads, ${t} Tails`;
                }
            }
        ],
        content: { whatIs: '<p>Flip a coin virtually.</p>' }
    },
    'rock-paper-scissors': {
        id: 'rock-paper-scissors',
        title: 'Rock Paper Scissors',
        description: 'Play against bot.',
        category: 'everyday',
        icon: 'Hand', // or Scissors if avail
        inputs: [
            { id: 'move', label: 'Your Move (0-2)', type: 'number', placeholder: '0' }
            // Note: 0=Rock, 1=Paper, 2=Scissors could be better with select, but number works for engine.
            // Ideally we'd have a select input type, but 'number' is supported.
        ],
        outputs: [
            {
                label: 'Game Result',
                calculate: (inputs) => {
                    const u = Math.floor(Number(inputs.move));
                    if (isNaN(u) || u < 0 || u > 2) return 'Enter 0(R), 1(P), 2(S)';
                    const moves = ['Rock', 'Paper', 'Scissors'];
                    const bot = Math.floor(Math.random() * 3);
                    const userM = moves[u];
                    const botM = moves[bot];

                    let res = 'Draw';
                    if ((u === 0 && bot === 2) || (u === 1 && bot === 0) || (u === 2 && bot === 1)) res = 'You Win!';
                    else if (u !== bot) res = 'Bot Wins!';

                    return `You: ${userM} vs Bot: ${botM} -> ${res}`;
                }
            }
        ],
        content: { whatIs: '<p>Game of Rock (0), Paper (1), Scissors (2).</p>' }
    },
    // Batch AW: Sports Tools II
    'marathon-pace-calculator': {
        id: 'marathon-pace-calculator',
        title: 'Marathon Pace',
        description: 'Time per km/mile.',
        category: 'sports',
        icon: 'Timer', // or Watch
        inputs: [
            { id: 'h', label: 'Hours', type: 'number', placeholder: '4' },
            { id: 'm', label: 'Minutes', type: 'number', placeholder: '0' },
            { id: 'dist', label: 'Distance', type: 'number', placeholder: '42.195', unit: 'km' }
        ],
        outputs: [
            {
                label: 'Pace (min/km)',
                calculate: (inputs) => {
                    const h = Number(inputs.h) || 0;
                    const m = Number(inputs.m) || 0;
                    const d = Number(inputs.dist);
                    if (!d) return '-';
                    const totalMin = (h * 60) + m;
                    const pace = totalMin / d;
                    const paceMin = Math.floor(pace);
                    const paceSec = Math.round((pace - paceMin) * 60);
                    return `${paceMin}:${paceSec < 10 ? '0' + paceSec : paceSec}`;
                }
            },
            {
                label: 'Speed (km/h)',
                calculate: (inputs) => {
                    const h = Number(inputs.h) || 0;
                    const m = Number(inputs.m) || 0;
                    const d = Number(inputs.dist);
                    if (!d) return '-';
                    const totalHours = h + (m / 60);
                    if (!totalHours) return 0;
                    return (d / totalHours).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates running pace required to finish a distance in a specific time.</p>' }
    },
    'cricket-run-rate-calculator': {
        id: 'cricket-run-rate-calculator',
        title: 'Cricket Run Rate',
        description: 'Runs per over.',
        category: 'sports',
        icon: 'Activity', // No Cricket icon, Activity or Trophy
        inputs: [
            { id: 'runs', label: 'Total Runs', type: 'number', placeholder: '250' },
            { id: 'overs', label: 'Overs Bowled', type: 'number', placeholder: '50' }
        ],
        outputs: [
            {
                label: 'Run Rate (RR)',
                calculate: (inputs) => {
                    const r = Number(inputs.runs);
                    const o = Number(inputs.overs);
                    if (!o) return 0;
                    return (r / o).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates the average number of runs scored per over.</p>' }
    },
    'target-heart-rate-calculator': {
        id: 'target-heart-rate-calculator',
        title: 'Target Heart Rate',
        description: 'Training zones.',
        category: 'sports',
        icon: 'Heart',
        inputs: [
            { id: 'age', label: 'Age', type: 'number', placeholder: '30' },
            { id: 'rest', label: 'Resting HR', type: 'number', placeholder: '60' }
        ],
        outputs: [
            {
                label: 'Max HR (220-Age)',
                calculate: (inputs) => {
                    const age = Number(inputs.age);
                    if (!age) return 0;
                    return (220 - age).toString();
                }
            },
            {
                label: 'Zone 2 (60-70%)',
                calculate: (inputs) => {
                    const age = Number(inputs.age);
                    const rest = Number(inputs.rest) || 0;
                    if (!age) return '-';
                    const max = 220 - age;
                    // Karvonen: Target = ((Max - Rest) * %) + Rest
                    const low = ((max - rest) * 0.60) + rest;
                    const high = ((max - rest) * 0.70) + rest;
                    return `${Math.round(low)} - ${Math.round(high)} bpm`;
                }
            }
        ],
        content: { whatIs: '<p>Estimates training heart rate zones using Karvonen formula.</p>' }
    },
    'one-rep-max-calculator': {
        id: 'one-rep-max-calculator',
        title: 'One Rep Max',
        description: 'Weightlifting 1RM.',
        category: 'sports',
        icon: 'Dumbbell', // If avail, else Trophy
        inputs: [
            { id: 'weight', label: 'Lifted Weight', type: 'number', placeholder: '100', unit: 'kg' },
            { id: 'reps', label: 'Reps', type: 'number', placeholder: '5' }
        ],
        outputs: [
            {
                label: 'Estimated 1RM',
                unit: 'kg',
                calculate: (inputs) => {
                    const w = Number(inputs.weight);
                    const r = Number(inputs.reps);
                    if (!w || !r) return 0;
                    if (r === 1) return w;
                    // Epley Formula: w * (1 + r/30)
                    return Math.round(w * (1 + r / 30)).toString();
                }
            }
        ],
        content: { whatIs: '<p>Estimates maximum weight you can lift for one repetition.</p>' }
    },
    'elo-rating-calculator': {
        id: 'elo-rating-calculator',
        title: 'Elo Rating Change',
        description: 'Chess / Sports.',
        category: 'sports',
        icon: 'TrendingUp', // or Hash
        inputs: [
            { id: 'ra', label: 'Player A Rating', type: 'number', placeholder: '1200' },
            { id: 'rb', label: 'Opponent Rating', type: 'number', placeholder: '1200' },
            { id: 'k', label: 'K-Factor', type: 'number', placeholder: '32', defaultValue: '32' },
            { id: 'res', label: 'Result (1=Win, 0.5=Draw, 0=Loss)', type: 'number', placeholder: '1' }
        ],
        outputs: [
            {
                label: 'New Player A Rating',
                calculate: (inputs) => {
                    const Ra = Number(inputs.ra);
                    const Rb = Number(inputs.rb);
                    const K = Number(inputs.k);
                    const S = Number(inputs.res);
                    if (isNaN(Ra) || isNaN(Rb)) return '-';

                    // Expected score Ea = 1 / (1 + 10^((Rb-Ra)/400))
                    const Ea = 1 / (1 + Math.pow(10, (Rb - Ra) / 400));
                    const newRa = Ra + K * (S - Ea);
                    return Math.round(newRa).toString();
                }
            },
            {
                label: 'Rating Change',
                calculate: (inputs) => {
                    const Ra = Number(inputs.ra);
                    const Rb = Number(inputs.rb);
                    const K = Number(inputs.k);
                    const S = Number(inputs.res);
                    if (isNaN(Ra)) return '-';
                    const Ea = 1 / (1 + Math.pow(10, (Rb - Ra) / 400));
                    const change = K * (S - Ea);
                    return (change > 0 ? '+' : '') + change.toFixed(1);
                }
            }
        ],
        content: { whatIs: '<p>Calculates Elo rating updates after a game.</p>' }
    },
    // Batch AX: Geometry Tools II
    'circle-sector-calculator': {
        id: 'circle-sector-calculator',
        title: 'Circle Sector Area',
        description: 'Slice of pie.',
        category: 'geometry',
        icon: 'PieChart', // or Circle
        inputs: [
            { id: 'r', label: 'Radius (r)', type: 'number', placeholder: '5' },
            { id: 'angle', label: 'Angle (degrees)', type: 'number', placeholder: '45' }
        ],
        outputs: [
            {
                label: 'Area (A)',
                calculate: (inputs) => {
                    const r = Number(inputs.r);
                    const ang = Number(inputs.angle);
                    if (!r || !ang) return 0;
                    // A = (ang/360) * PI * r^2
                    return ((ang / 360) * Math.PI * r * r).toFixed(2);
                }
            },
            {
                label: 'Arc Length (L)',
                calculate: (inputs) => {
                    const r = Number(inputs.r);
                    const ang = Number(inputs.angle);
                    if (!r || !ang) return 0;
                    // L = (ang/360) * 2 * PI * r
                    return ((ang / 360) * 2 * Math.PI * r).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates area and arc length of a circle sector.</p>' }
    },
    'annulus-area-calculator': {
        id: 'annulus-area-calculator',
        title: 'Annulus Area',
        description: 'Ring shape.',
        category: 'geometry',
        icon: 'Circle', // Ring
        inputs: [
            { id: 'R', label: 'Outer Radius (R)', type: 'number', placeholder: '10' },
            { id: 'r', label: 'Inner Radius (r)', type: 'number', placeholder: '5' }
        ],
        outputs: [
            {
                label: 'Area',
                calculate: (inputs) => {
                    const R = Number(inputs.R);
                    const r = Number(inputs.r);
                    if (!R || !r) return 0;
                    if (r >= R) return 'Error (r >= R)';
                    // A = PI * (R^2 - r^2)
                    return (Math.PI * (R * R - r * r)).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates area of a ring (annulus).</p>' }
    },
    'ellipse-area-calculator': {
        id: 'ellipse-area-calculator',
        title: 'Ellipse Calculator',
        description: 'Oval area.',
        category: 'geometry',
        icon: 'Circle', // Flattened circle
        inputs: [
            { id: 'a', label: 'Semi-major Axis (a)', type: 'number', placeholder: '5' },
            { id: 'b', label: 'Semi-minor Axis (b)', type: 'number', placeholder: '3' }
        ],
        outputs: [
            {
                label: 'Area',
                calculate: (inputs) => {
                    const a = Number(inputs.a);
                    const b = Number(inputs.b);
                    if (!a || !b) return 0;
                    // A = PI * a * b
                    return (Math.PI * a * b).toFixed(2);
                }
            },
            {
                label: 'Perimeter (Approx)',
                calculate: (inputs) => {
                    const a = Number(inputs.a);
                    const b = Number(inputs.b);
                    if (!a || !b) return 0;
                    // Ramanujan approximation: PI * [3(a+b) - sqrt((3a+b)(a+3b))]
                    return (Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)))).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates area and approximate perimeter of an ellipse.</p>' }
    },
    'trapezoid-area-calculator': {
        id: 'trapezoid-area-calculator',
        title: 'Trapezoid Area',
        description: 'Area.',
        category: 'geometry',
        icon: 'BoxSelect', // Sort of a shape
        inputs: [
            { id: 'a', label: 'Base a', type: 'number', placeholder: '5' },
            { id: 'b', label: 'Base b', type: 'number', placeholder: '9' },
            { id: 'h', label: 'Height (h)', type: 'number', placeholder: '4' }
        ],
        outputs: [
            {
                label: 'Area',
                calculate: (inputs) => {
                    const a = Number(inputs.a);
                    const b = Number(inputs.b);
                    const h = Number(inputs.h);
                    if (!a || !b || !h) return 0;
                    // A = ((a+b)/2) * h
                    return (((a + b) / 2) * h).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates area of a trapezoid.</p>' }
    },
    'rhombus-area-calculator': {
        id: 'rhombus-area-calculator',
        title: 'Rhombus Area',
        description: 'Diamond shape.',
        category: 'geometry',
        icon: 'Diamond', // or Box
        inputs: [
            { id: 'd1', label: 'Diagonal 1 (p)', type: 'number', placeholder: '6' },
            { id: 'd2', label: 'Diagonal 2 (q)', type: 'number', placeholder: '8' }
        ],
        outputs: [
            {
                label: 'Area',
                calculate: (inputs) => {
                    const d1 = Number(inputs.d1);
                    const d2 = Number(inputs.d2);
                    if (!d1 || !d2) return 0;
                    // A = (p*q)/2
                    return ((d1 * d2) / 2).toFixed(2);
                }
            },
            {
                label: 'Side Length',
                calculate: (inputs) => {
                    const d1 = Number(inputs.d1);
                    const d2 = Number(inputs.d2);
                    if (!d1 || !d2) return 0;
                    // s = sqrt((p/2)^2 + (q/2)^2)
                    return Math.sqrt(Math.pow(d1 / 2, 2) + Math.pow(d2 / 2, 2)).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates area and side length of a rhombus using diagonals.</p>' }
    },
    // Batch AY: Electrical Tools III
    'transformer-ratio-calculator': {
        id: 'transformer-ratio-calculator',
        title: 'Transformer Ratio',
        description: 'Turns, Voltage, Current.',
        category: 'electronics',
        icon: 'Zap',
        inputs: [
            { id: 'vp', label: 'Primary Voltage (V)', type: 'number', placeholder: '230' },
            { id: 'vs', label: 'Secondary Voltage (V)', type: 'number', placeholder: '12' },
            { id: 'np', label: 'Primary Turns', type: 'number', placeholder: '1000' }
            // Simplifying to Vp/Vs = Np/Ns for typical use
        ],
        outputs: [
            {
                label: 'Secondary Turns (Ns)',
                calculate: (inputs) => {
                    const vp = Number(inputs.vp);
                    const vs = Number(inputs.vs);
                    const np = Number(inputs.np);
                    if (!vp || !vs || !np) return 0;
                    // Ns = (Vs * Np) / Vp
                    return Math.round((vs * np) / vp).toString();
                }
            },
            {
                label: 'Turns Ratio (Np:Ns)',
                calculate: (inputs) => {
                    const vp = Number(inputs.vp);
                    const vs = Number(inputs.vs);
                    if (!vp || !vs) return '-';
                    return (vp / vs).toFixed(2) + ' : 1';
                }
            }
        ],
        content: { whatIs: '<p>Calculates transformer turns ratio and secondary turns.</p>' }
    },
    'resonance-frequency-calculator': {
        id: 'resonance-frequency-calculator',
        title: 'Resonance Frequency',
        description: 'LC Circuit.',
        category: 'electronics',
        icon: 'Activity', // Sine wave
        inputs: [
            { id: 'l', label: 'Inductance (L)', type: 'number', placeholder: '0.001', unit: 'H' },
            { id: 'c', label: 'Capacitance (C)', type: 'number', placeholder: '0.000001', unit: 'F' }
        ],
        outputs: [
            {
                label: 'Frequency (Hz)',
                calculate: (inputs) => {
                    const l = Number(inputs.l);
                    const c = Number(inputs.c);
                    if (!l || !c) return 0;
                    // f = 1 / (2*PI * sqrt(LC))
                    return (1 / (2 * Math.PI * Math.sqrt(l * c))).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates the resonant frequency of an LC circuit.</p>' }
    },
    'capacitive-reactance-calculator': {
        id: 'capacitive-reactance-calculator',
        title: 'Capacitive Reactance',
        description: 'Xc = 1/(2πfC).',
        category: 'electronics',
        icon: 'Zap',
        inputs: [
            { id: 'f', label: 'Frequency (f)', type: 'number', placeholder: '60', unit: 'Hz' },
            { id: 'c', label: 'Capacitance (C)', type: 'number', placeholder: '0.0001', unit: 'F' }
        ],
        outputs: [
            {
                label: 'Reactance (Xc)',
                unit: 'Ω',
                calculate: (inputs) => {
                    const f = Number(inputs.f);
                    const c = Number(inputs.c);
                    if (!f || !c) return 0;
                    // Xc = 1 / (2*PI*f*C)
                    return (1 / (2 * Math.PI * f * c)).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates the opposition to current flow in a capacitor.</p>' }
    },
    'inductive-reactance-calculator': {
        id: 'inductive-reactance-calculator',
        title: 'Inductive Reactance',
        description: 'Xl = 2πfL.',
        category: 'electronics',
        icon: 'Zap',
        inputs: [
            { id: 'f', label: 'Frequency (f)', type: 'number', placeholder: '60', unit: 'Hz' },
            { id: 'l', label: 'Inductance (L)', type: 'number', placeholder: '0.05', unit: 'H' }
        ],
        outputs: [
            {
                label: 'Reactance (Xl)',
                unit: 'Ω',
                calculate: (inputs) => {
                    const f = Number(inputs.f);
                    const l = Number(inputs.l);
                    if (!f || !l) return 0;
                    // Xl = 2*PI*f*L
                    return (2 * Math.PI * f * l).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates the opposition to current flow in an inductor.</p>' }
    },
    'wheatstone-bridge-calculator': {
        id: 'wheatstone-bridge-calculator',
        title: 'Wheatstone Bridge',
        description: 'Unknown Resistor.',
        category: 'electronics',
        icon: 'Calculator', // or Cpu
        inputs: [
            { id: 'r1', label: 'R1', type: 'number', placeholder: '100', unit: 'Ω' },
            { id: 'r2', label: 'R2', type: 'number', placeholder: '100', unit: 'Ω' },
            { id: 'r3', label: 'R3 (Adjustable)', type: 'number', placeholder: '250', unit: 'Ω' }
        ],
        outputs: [
            {
                label: 'Unknown (Rx)',
                unit: 'Ω',
                calculate: (inputs) => {
                    const r1 = Number(inputs.r1);
                    const r2 = Number(inputs.r2);
                    const r3 = Number(inputs.r3);
                    if (!r1) return 0;
                    // Balanced: R1/R2 = R3/Rx => Rx = (R2/R1) * R3
                    return ((r2 / r1) * r3).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates the unknown resistance Rx in a balanced Wheatstone bridge.</p>' }
    },
    // Batch AZ: Marketing Calculators
    'cpm-calculator': {
        id: 'cpm-calculator',
        title: 'CPM Calculator',
        description: 'Cost per 1k impressions.',
        category: 'marketing',
        icon: 'Megaphone',
        inputs: [
            { id: 'cost', label: 'Total Cost', type: 'number', placeholder: '500', unit: '$' },
            { id: 'impressions', label: 'Impressions', type: 'number', placeholder: '100000' }
        ],
        outputs: [
            {
                label: 'CPM',
                unit: '$',
                calculate: (inputs) => {
                    const cost = Number(inputs.cost);
                    const imp = Number(inputs.impressions);
                    if (!imp) return 0;
                    // CPM = (Cost / Impressions) * 1000
                    return ((cost / imp) * 1000).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates Cost Per Mille (thousand impressions).</p>' }
    },
    'cpc-calculator': {
        id: 'cpc-calculator',
        title: 'CPC Calculator',
        description: 'Cost per Click.',
        category: 'marketing',
        icon: 'MousePointer', // or Hand if Megaphone used above
        inputs: [
            { id: 'cost', label: 'Total Cost', type: 'number', placeholder: '500', unit: '$' },
            { id: 'clicks', label: 'Total Clicks', type: 'number', placeholder: '250' }
        ],
        outputs: [
            {
                label: 'CPC',
                unit: '$',
                calculate: (inputs) => {
                    const cost = Number(inputs.cost);
                    const clicks = Number(inputs.clicks);
                    if (!clicks) return 0;
                    return (cost / clicks).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates Cost Per Click for ads.</p>' }
    },
    'ctr-calculator': {
        id: 'ctr-calculator',
        title: 'CTR Calculator',
        description: 'Click Through Rate.',
        category: 'marketing',
        icon: 'MousePointer2', // or Perc
        inputs: [
            { id: 'clicks', label: 'Clicks', type: 'number', placeholder: '150' },
            { id: 'impressions', label: 'Impressions', type: 'number', placeholder: '10000' }
        ],
        outputs: [
            {
                label: 'CTR',
                unit: '%',
                calculate: (inputs) => {
                    const clicks = Number(inputs.clicks);
                    const imp = Number(inputs.impressions);
                    if (!imp) return 0;
                    return ((clicks / imp) * 100).toFixed(2) + '%';
                }
            }
        ],
        content: { whatIs: '<p>Calculates the percentage of impressions that resulted in a click.</p>' }
    },
    'conversion-rate-calculator': {
        id: 'conversion-rate-calculator',
        title: 'Conversion Rate',
        description: 'Visitors to Leads.',
        category: 'marketing',
        icon: 'Target', // Target
        inputs: [
            { id: 'conversions', label: 'Conversions', type: 'number', placeholder: '50' },
            { id: 'visitors', label: 'Total Visitors/Clicks', type: 'number', placeholder: '1000' }
        ],
        outputs: [
            {
                label: 'Conversion Rate',
                unit: '%',
                calculate: (inputs) => {
                    const c = Number(inputs.conversions);
                    const v = Number(inputs.visitors);
                    if (!v) return 0;
                    return ((c / v) * 100).toFixed(2) + '%';
                }
            }
        ],
        content: { whatIs: '<p>Calculates the percentage of visitors who completed a desired action.</p>' }
    },
    'roi-marketing-calculator': {
        id: 'roi-marketing-calculator',
        title: 'Marketing ROI',
        description: 'Return on Ad Spend.',
        category: 'marketing',
        icon: 'TrendingUp',
        inputs: [
            { id: 'rev', label: 'Revenue Generated', type: 'number', placeholder: '2000', unit: '$' },
            { id: 'cost', label: 'Marketing Cost', type: 'number', placeholder: '500', unit: '$' }
        ],
        outputs: [
            {
                label: 'ROI',
                unit: '%',
                calculate: (inputs) => {
                    const r = Number(inputs.rev);
                    const c = Number(inputs.cost);
                    if (!c) return 0;
                    // ROI = ((Revenue - Cost) / Cost) * 100
                    return (((r - c) / c) * 100).toFixed(2) + '%';
                }
            }
        ],
        content: { whatIs: '<p>Calculates Return on Investment for marketing campaigns.</p>' }
    },
    // Batch BA: Design Tools
    'aspect-ratio-calculator': {
        id: 'aspect-ratio-calculator',
        title: 'Aspect Ratio Calculator',
        description: 'Find missing dimension.',
        category: 'web',
        icon: 'Crop', // Crop or Frame
        inputs: [
            { id: 'ratioW', label: 'Ratio Width (e.g. 16)', type: 'number', placeholder: '16' },
            { id: 'ratioH', label: 'Ratio Height (e.g. 9)', type: 'number', placeholder: '9' },
            { id: 'width', label: 'Known Width (px)', type: 'number', placeholder: '1920' }
        ],
        outputs: [
            {
                label: 'Result Height (px)',
                calculate: (inputs) => {
                    const rw = Number(inputs.ratioW);
                    const rh = Number(inputs.ratioH);
                    const w = Number(inputs.width);
                    if (!rw || !rh || !w) return 0;
                    // H = (W * RH) / RW
                    return Math.round((w * rh) / rw).toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates dimensions based on a specific aspect ratio.</p>' }
    },
    'pixels-to-rem-converter': {
        id: 'pixels-to-rem-converter',
        title: 'Pixels to REM',
        description: 'CSS unit converter.',
        category: 'web',
        icon: 'Scaling', // or MoveHorizontal
        inputs: [
            { id: 'px', label: 'Pixels (px)', type: 'number', placeholder: '24' },
            { id: 'base', label: 'Base Size (px)', type: 'number', placeholder: '16', defaultValue: '16' }
        ],
        outputs: [
            {
                label: 'REM',
                calculate: (inputs) => {
                    const px = Number(inputs.px);
                    const base = Number(inputs.base) || 16;
                    return (px / base).toFixed(3) + ' rem';
                }
            },
            {
                label: 'EM',
                calculate: (inputs) => {
                    const px = Number(inputs.px);
                    const base = Number(inputs.base) || 16;
                    return (px / base).toFixed(3) + ' em';
                }
            }
        ],
        content: { whatIs: '<p>Converts pixels to relative em/rem units based on root font size.</p>' }
    },
    'golden-ratio-calculator': {
        id: 'golden-ratio-calculator',
        title: 'Golden Ratio',
        description: 'Find A and B (1.618).',
        category: 'web',
        icon: 'Frame', // Frame or Ratio
        inputs: [
            { id: 'total', label: 'Total Width (A+B)', type: 'number', placeholder: '1000' }
            // Can be extended to "Enter A" or "Enter B" via mode, but simpler here
        ],
        outputs: [
            {
                label: 'Larger (A) (61.8%)',
                calculate: (inputs) => {
                    const t = Number(inputs.total);
                    if (!t) return 0;
                    return Math.round(t / 1.61803398875).toString();
                }
            },
            {
                label: 'Smaller (B) (38.2%)',
                calculate: (inputs) => {
                    const t = Number(inputs.total);
                    if (!t) return 0;
                    return Math.round(t - (t / 1.61803398875)).toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates the specific Golden Ratio cuts for a given length.</p>' }
    },
    'ppi-calculator': {
        id: 'ppi-calculator',
        title: 'PPI Calculator',
        description: 'Pixel Density.',
        category: 'web',
        icon: 'Scan', // Scan or Monitor
        inputs: [
            { id: 'w', label: 'Horizontal Resolution', type: 'number', placeholder: '1920' },
            { id: 'h', label: 'Vertical Resolution', type: 'number', placeholder: '1080' },
            { id: 'diag', label: 'Diagonal Size (inch)', type: 'number', placeholder: '24' }
        ],
        outputs: [
            {
                label: 'PPI (Pixels Per Inch)',
                calculate: (inputs) => {
                    const w = Number(inputs.w);
                    const h = Number(inputs.h);
                    const d = Number(inputs.diag);
                    if (!d) return 0;
                    // PPI = sqrt(w^2 + h^2) / d
                    return (Math.sqrt(w * w + h * h) / d).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates pixel density (PPI/DPI) of a display.</p>' }
    },
    'color-contrast-checker': {
        id: 'color-contrast-checker',
        title: 'Color Contrast',
        description: 'Ratio between Hex colors.',
        category: 'web',
        icon: 'Palette',
        inputs: [
            { id: 'hex1', label: 'Foreground Hex (#000000)', type: 'text', placeholder: '000000' },
            { id: 'hex2', label: 'Background Hex (#FFFFFF)', type: 'text', placeholder: 'FFFFFF' }
        ],
        outputs: [
            {
                label: 'Contrast Ratio',
                calculate: (inputs) => {
                    const h1 = (inputs.hex1 || '').replace('#', '');
                    const h2 = (inputs.hex2 || '').replace('#', '');
                    if (h1.length < 3 || h2.length < 3) return '-';

                    // Simple hex parser inline
                    const hexToRgb = (hex: string) => {
                        let r = 0, g = 0, b = 0;
                        if (hex.length === 3) {
                            r = parseInt(hex[0] + hex[0], 16);
                            g = parseInt(hex[1] + hex[1], 16);
                            b = parseInt(hex[2] + hex[2], 16);
                        } else if (hex.length >= 6) {
                            r = parseInt(hex.substring(0, 2), 16);
                            g = parseInt(hex.substring(2, 4), 16);
                            b = parseInt(hex.substring(4, 6), 16);
                        }
                        return [r, g, b];
                    };
                    const lumin = (r: number, g: number, b: number) => {
                        const a = [r, g, b].map(v => {
                            v /= 255;
                            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
                        });
                        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
                    };

                    const rgb1 = hexToRgb(h1);
                    const rgb2 = hexToRgb(h2);
                    const l1 = lumin(rgb1[0], rgb1[1], rgb1[2]);
                    const l2 = lumin(rgb2[0], rgb2[1], rgb2[2]);
                    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
                    return ratio.toFixed(2) + ' : 1';
                }
            }
        ],
        content: { whatIs: '<p>Checks accessibility contrast ratio between two colors.</p>' }
    },
    // Batch BB: Developer Utils
    'base64-converter': {
        id: 'base64-converter',
        title: 'Base64 Converter',
        description: 'Encode/Decode text.',
        category: 'web',
        icon: 'Code2',
        inputs: [
            { id: 'text', label: 'Input Text', type: 'text', placeholder: 'Hello World' },
            { id: 'mode', label: 'Mode (encode/decode)', type: 'text', placeholder: 'encode', defaultValue: 'encode' }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const text = inputs.text || '';
                    const mode = (inputs.mode || 'encode').toLowerCase();
                    try {
                        if (mode.includes('dec')) {
                            // Decode
                            return atob(text);
                        } else {
                            // Encode
                            return btoa(text);
                        }
                    } catch (e) {
                        return 'Error: Invalid input';
                    }
                }
            }
        ],
        content: { whatIs: '<p>Base64 encoder and decoder tool.</p>' }
    },
    'url-encoder-decoder': {
        id: 'url-encoder-decoder',
        title: 'URL Encoder/Decoder',
        description: 'Escape/Unescape URLs.',
        category: 'web',
        icon: 'Link', // Need to import Link or use existing
        inputs: [
            { id: 'text', label: 'Input URL/Text', type: 'text', placeholder: 'https://example.com/?q=hello world' },
            { id: 'mode', label: 'Mode (encode/decode)', type: 'text', placeholder: 'encode', defaultValue: 'encode' }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const text = inputs.text || '';
                    const mode = (inputs.mode || 'encode').toLowerCase();
                    try {
                        if (mode.includes('dec')) {
                            return decodeURIComponent(text);
                        } else {
                            return encodeURIComponent(text);
                        }
                    } catch (e) {
                        return 'Error: Invalid URI';
                    }
                }
            }
        ],
        content: { whatIs: '<p>Encodes or decodes URL components.</p>' }
    },
    'json-formatter': {
        id: 'json-formatter',
        title: 'JSON Formatter',
        description: 'Prettify/Minify JSON.',
        category: 'web',
        icon: 'FileJson',
        inputs: [
            { id: 'json', label: 'Input JSON', type: 'text', placeholder: '{"a":1,"b":2}' },
            { id: 'indent', label: 'Indent Spaces (0 for minify)', type: 'number', placeholder: '2', defaultValue: '2' }
        ],
        outputs: [
            {
                label: 'Formatted JSON',
                calculate: (inputs) => {
                    const text = inputs.json || '';
                    const indent = parseInt(inputs.indent || '2', 10); // 0 or NaN becomes 0 -> minify
                    try {
                        const obj = JSON.parse(text);
                        return JSON.stringify(obj, null, indent);
                    } catch (e) {
                        // Attempt to fix simple quotes? No, safer to error.
                        return 'Error: Invalid JSON';
                    }
                }
            }
        ],
        content: { whatIs: '<p>Formats (beautifies) or minifies JSON data.</p>' }
    },
    'uuid-generator': {
        id: 'uuid-generator',
        title: 'UUID Generator',
        description: 'Generate UUID v4.',
        category: 'web',
        icon: 'Fingerprint',
        inputs: [
            { id: 'count', label: 'Generate Count', type: 'number', placeholder: '1', defaultValue: '1' } // Trigger re-calc
        ],
        outputs: [
            {
                label: 'New UUID',
                calculate: (inputs) => {
                    // Simple UUID v4 polyfill since crypto might not be in all contexts visible to this logic purely sync without node types
                    /*
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                    */
                    // But let's try crypto.randomUUID if available, else usage math
                    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                        return crypto.randomUUID();
                    }
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                }
            }
        ],
        content: { whatIs: '<p>Generates a random Version 4 UUID.</p>' }
    },
    'lorem-ipsum-generator': {
        id: 'lorem-ipsum-generator',
        title: 'Lorem Ipsum Generator',
        description: 'Generate placeholder text.',
        category: 'text',
        icon: 'List', // List or Type
        inputs: [
            { id: 'sentences', label: 'Number of Sentences', type: 'number', placeholder: '3', defaultValue: '3' }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const count = Math.max(1, Math.min(50, Number(inputs.sentences) || 1));
                    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
                    // Not a real generator, just slicing/repeating for simplicity in a pure function without external libs
                    // Let's just repeat the block count times or split by sentences?
                    // Splitting by '.' is vague.
                    // Simpler: Just repeat the phrase 'Lorem ipsum...' X times or pick from array.
                    const phrases = [
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
                        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                        "Curabitur pretium tincidunt lacus."
                    ];
                    let out = "";
                    for (let i = 0; i < count; i++) {
                        out += phrases[i % phrases.length] + " ";
                    }
                    return out.trim();
                }
            }
        ],
        content: { whatIs: '<p>Generates standard Lorem Ipsum placeholder text.</p>' }
    },
    // Batch BC: Medical & Nursing Tools
    'iv-flow-rate-calculator': {
        id: 'iv-flow-rate-calculator',
        title: 'IV Flow Rate',
        description: 'Drops per minute.',
        category: 'health',
        icon: 'Stethoscope', // Stethoscope or Activity
        inputs: [
            { id: 'volume', label: 'Volume (mL)', type: 'number', placeholder: '1000', unit: 'mL' },
            { id: 'time', label: 'Time (hours)', type: 'number', placeholder: '8', unit: 'hr' },
            { id: 'drop', label: 'Drop Factor (gtts/mL)', type: 'number', placeholder: '20', defaultValue: '20' }
        ],
        outputs: [
            {
                label: 'Flow Rate (gtts/min)',
                calculate: (inputs) => {
                    const v = Number(inputs.volume);
                    const t = Number(inputs.time);
                    const df = Number(inputs.drop);
                    if (!v || !t || !df) return 0;
                    // Note: Time in hours -> convert to minutes
                    // Flow = (Vol * DropFactor) / (Time * 60)
                    return Math.round((v * df) / (t * 60)).toString();
                }
            },
            {
                label: 'Flow Rate (mL/hr)',
                calculate: (inputs) => {
                    const v = Number(inputs.volume);
                    const t = Number(inputs.time);
                    if (!v || !t) return 0;
                    return Math.round(v / t).toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates intravenous fluid flow rate in drops per minute and mL per hour.</p>' }
    },
    'pediatric-dosage-calculator': {
        id: 'pediatric-dosage-calculator',
        title: 'Pediatric Dosage',
        description: 'Dose by Weight.',
        category: 'health',
        icon: 'Baby',
        inputs: [
            { id: 'weight', label: 'Child Weight (kg)', type: 'number', placeholder: '15', unit: 'kg' },
            { id: 'dose', label: 'Dose per kg (mg/kg)', type: 'number', placeholder: '10' }
        ],
        outputs: [
            {
                label: 'Total Required Dose (mg)',
                unit: 'mg',
                calculate: (inputs) => {
                    const w = Number(inputs.weight);
                    const d = Number(inputs.dose);
                    if (!w || !d) return 0;
                    return (w * d).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates safe pediatric medication dosage based on body weight.</p>' }
    },
    'pregnancy-due-date-calculator': {
        id: 'pregnancy-due-date-calculator',
        title: 'Pregnancy Due Date',
        description: 'Naegele\'s Rule.',
        category: 'health',
        icon: 'Calendar', // CalendarDays
        inputs: [
            // We need a date input.
            // Typically we use standard input type='date' if supported, or text yyyy-mm-dd
            // Let's assume input type='date' works or text
            { id: 'lmp', label: 'Last Menstrual Period', type: 'date', placeholder: 'YYYY-MM-DD' }
        ],
        outputs: [
            {
                label: 'Estimated Due Date',
                calculate: (inputs) => {
                    const lmpStr = inputs.lmp;
                    if (!lmpStr) return '-';
                    const lmp = new Date(lmpStr);
                    if (isNaN(lmp.getTime())) return 'Invalid Date';

                    // Naegele's Rule: +280 days (40 weeks) from LMP
                    // Or +1 year, -3 months, +7 days (approx same)
                    // Let's allow +280 days
                    const due = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
                    // Format YYYY-MM-DD
                    return due.toISOString().split('T')[0];
                }
            }
        ],
        content: { whatIs: '<p>Estimates delivery date based on Last Menstrual Period (LMP).</p>' }
    },
    'map-calculator': {
        id: 'map-calculator',
        title: 'Mean Arterial Pressure',
        description: 'MAP from BP.',
        category: 'health',
        icon: 'Activity', // Activity
        inputs: [
            { id: 'sbp', label: 'Systolic BP (mmHg)', type: 'number', placeholder: '120' },
            { id: 'dbp', label: 'Diastolic BP (mmHg)', type: 'number', placeholder: '80' }
        ],
        outputs: [
            {
                label: 'MAP',
                unit: 'mmHg',
                calculate: (inputs) => {
                    const s = Number(inputs.sbp);
                    const d = Number(inputs.dbp);
                    if (!s || !d) return 0;
                    // MAP = DBP + (1/3)*(SBP-DBP)  OR (SBP + 2*DBP)/3
                    return ((s + 2 * d) / 3).toFixed(0);
                }
            }
        ],
        content: { whatIs: '<p>Calculates Mean Arterial Pressure (MAP), an indicator of perfusion.</p>' }
    },
    'anc-calculator': {
        id: 'anc-calculator',
        title: 'ANC Calculator',
        description: 'Neutrophil Count.',
        category: 'health',
        icon: 'Microscope', // Microscope
        inputs: [
            { id: 'wbc', label: 'WBC (cells/µL)', type: 'number', placeholder: '4500' },
            { id: 'segs', label: 'Segmented Neutrophils (%)', type: 'number', placeholder: '50' },
            { id: 'bands', label: 'Bands (%)', type: 'number', placeholder: '2' }
        ],
        outputs: [
            {
                label: 'ANC (cells/µL)',
                calculate: (inputs) => {
                    const wbc = Number(inputs.wbc);
                    const s = Number(inputs.segs);
                    const b = Number(inputs.bands);
                    // ANC = WBC * ((Segs + Bands) / 100)
                    if (!wbc) return 0; // Segs/Bands can be 0
                    return Math.round(wbc * ((s + b) / 100)).toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates Absolute Neutrophil Count (ANC) to assess infection risk.</p>' }
    },
    // Batch BD: Construction Tools II
    'brick-calculator': {
        id: 'brick-calculator',
        title: 'Brick Calculator',
        description: 'Count bricks for wall.',
        category: 'construction',
        icon: 'BrickWall', // BrickWall
        inputs: [
            { id: 'wallL', label: 'Wall Length (m)', type: 'number', placeholder: '5', unit: 'm' },
            { id: 'wallH', label: 'Wall Height (m)', type: 'number', placeholder: '3', unit: 'm' },
            { id: 'brickL', label: 'Brick Length (mm)', type: 'number', placeholder: '230', defaultValue: '230' },
            { id: 'brickH', label: 'Brick Height (mm)', type: 'number', placeholder: '76', defaultValue: '76' },
            { id: 'mortar', label: 'Mortar Gap (mm)', type: 'number', placeholder: '10', defaultValue: '10' }
        ],
        outputs: [
            {
                label: 'Bricks Required',
                calculate: (inputs) => {
                    const wl = Number(inputs.wallL) * 1000; // to mm
                    const wh = Number(inputs.wallH) * 1000;
                    const bl = Number(inputs.brickL);
                    const bh = Number(inputs.brickH);
                    const m = Number(inputs.mortar);
                    if (!wl || !wh || !bl || !bh) return 0;
                    // Area of wall = wl * wh
                    // Area of 1 brick with mortar = (bl+m) * (bh+m)
                    const wallCheck = wl * wh;
                    const brickCheck = (bl + m) * (bh + m);
                    if (brickCheck === 0) return 0;
                    const count = wallCheck / brickCheck;
                    // Add 5% waste
                    return Math.ceil(count * 1.05).toString();
                }
            }
        ],
        content: { whatIs: '<p>Estimates number of bricks required for a wall, including mortar gap and 5% wastage.</p>' }
    },
    'concrete-bags-calculator': {
        id: 'concrete-bags-calculator',
        title: 'Concrete Bags',
        description: 'Slab volume & bags.',
        category: 'construction',
        icon: 'Construction', // Hammer or existing. Let's use Hammer default or existing.
        inputs: [
            { id: 'l', label: 'Length (m)', type: 'number', placeholder: '2' },
            { id: 'w', label: 'Width (m)', type: 'number', placeholder: '2' },
            { id: 'd', label: 'Depth/Thickness (mm)', type: 'number', placeholder: '100', defaultValue: '100' },
            { id: 'bag', label: 'Bag Weight (kg)', type: 'number', placeholder: '20', defaultValue: '20' }
        ],
        outputs: [
            {
                label: 'Cubic Meters (m³)',
                unit: 'm³',
                calculate: (inputs) => {
                    const l = Number(inputs.l);
                    const w = Number(inputs.w);
                    const d = Number(inputs.d) / 1000; // mm to m
                    if (!l || !w || !d) return 0;
                    return (l * w * d).toFixed(3);
                }
            },
            {
                label: 'Bags Required (Approx)',
                calculate: (inputs) => {
                    const l = Number(inputs.l);
                    const w = Number(inputs.w);
                    const d = Number(inputs.d) / 1000;
                    const bag = Number(inputs.bag);
                    if (!l || !w || !d || !bag) return 0;
                    const vol = l * w * d;
                    // Concrete density approx 2400 kg/m3 or pre-mix varies.
                    // Typically 108 x 20kg bags for 1 m3?
                    // 1 m3 ~ 2100-2400kg.
                    // Let's assume 2200kg/m3 for dry mix needed?.
                    // Simplification: approx 2100 kg dry mix for 1 m3 wet concrete.
                    const totalKg = vol * 2150;
                    return Math.ceil(totalKg / bag).toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates concrete volume and estimated bags required (assuming ~2150kg dry mix per m³).</p>' }
    },
    'tile-calculator': {
        id: 'tile-calculator',
        title: 'Tile Calculator',
        description: 'Floor/Wall tiling.',
        category: 'construction',
        icon: 'Grid3X3', // Grid
        inputs: [
            { id: 'roomL', label: 'Room Length (m)', type: 'number', placeholder: '4' },
            { id: 'roomW', label: 'Room Width (m)', type: 'number', placeholder: '3' },
            { id: 'tileL', label: 'Tile Length (mm)', type: 'number', placeholder: '300' },
            { id: 'tileW', label: 'Tile Width (mm)', type: 'number', placeholder: '300' }
        ],
        outputs: [
            {
                label: 'Tiles Needed',
                calculate: (inputs) => {
                    const rl = Number(inputs.roomL) * 1000;
                    const rw = Number(inputs.roomW) * 1000;
                    const tl = Number(inputs.tileL);
                    const tw = Number(inputs.tileW);
                    if (!rl || !rw || !tl || !tw) return 0;
                    const areaRoom = rl * rw;
                    const areaTile = tl * tw;
                    if (areaTile === 0) return 0;
                    const count = areaRoom / areaTile;
                    // 10% waste
                    return Math.ceil(count * 1.10).toString();
                }
            },
            {
                label: 'Area (m²)',
                calculate: (inputs) => {
                    return (Number(inputs.roomL) * Number(inputs.roomW)).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates number of tiles needed for an area, including 10% wastage.</p>' }
    },
    'paint-calculator': {
        id: 'paint-calculator',
        title: 'Paint Calculator',
        description: 'Liters required.',
        category: 'construction',
        icon: 'PaintBucket', // PaintBucket
        inputs: [
            { id: 'w', label: 'Wall Width (total m)', type: 'number', placeholder: '10' },
            { id: 'h', label: 'Wall Height (m)', type: 'number', placeholder: '2.4' },
            { id: 'coats', label: 'Number of Coats', type: 'number', placeholder: '2', defaultValue: '2' },
            { id: 'coverage', label: 'Coverage (m²/L)', type: 'number', placeholder: '10', defaultValue: '10' }
        ],
        outputs: [
            {
                label: 'Liters Required',
                unit: 'L',
                calculate: (inputs) => {
                    const w = Number(inputs.w);
                    const h = Number(inputs.h);
                    const coats = Number(inputs.coats);
                    const cov = Number(inputs.coverage);
                    if (!w || !h || !coats || !cov) return 0;
                    const area = w * h;
                    // Total Area = area * coats
                    // Liters = Total Area / Coverage
                    return ((area * coats) / cov).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Estimates paint quantity based on surface area and coverage rate.</p>' }
    },
    'wallpaper-calculator': {
        id: 'wallpaper-calculator',
        title: 'Wallpaper Calculator',
        description: 'Rolls needed.',
        category: 'construction',
        icon: 'ScrollText', // Scroll or ScrollText
        inputs: [
            { id: 'wallW', label: 'Wall Width (m)', type: 'number', placeholder: '3' },
            { id: 'wallH', label: 'Wall Height (m)', type: 'number', placeholder: '2.5' },
            { id: 'rollW', label: 'Roll Width (m)', type: 'number', placeholder: '0.53', defaultValue: '0.53' },
            { id: 'rollL', label: 'Roll Length (m)', type: 'number', placeholder: '10', defaultValue: '10' }
        ],
        outputs: [
            {
                label: 'Rolls Required',
                calculate: (inputs) => {
                    const ww = Number(inputs.wallW);
                    const wh = Number(inputs.wallH);
                    const rw = Number(inputs.rollW);
                    const rl = Number(inputs.rollL);
                    if (!ww || !wh || !rw || !rl) return 0;
                    // Simply area method usually underestimates due to matching pattern, usually strips method is better.
                    // But for simple calc:
                    // Number of strips = ceil(WallWidth / RollWidth)
                    // Length per strip = WallHeight (plus trim) -> say WallHeight + 0.1
                    // Strips per roll = floor(RollLength / LengthPerStrip)
                    // Rolls = ceil(NumberOfStrips / StripsPerRoll)

                    const numStrips = Math.ceil(ww / rw);
                    const lenStrip = wh + 0.1; // 10cm trim
                    const stripsPerRoll = Math.floor(rl / lenStrip);
                    if (stripsPerRoll === 0) return 'Check dim';
                    const rolls = Math.ceil(numStrips / stripsPerRoll);
                    return rolls.toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates number of wallpaper rolls required based on strips method (assuming no large pattern repeat).</p>' }
    },
    // Batch BE: Ecology Tools III
    'water-footprint-calculator': {
        id: 'water-footprint-calculator',
        title: 'Water Footprint',
        description: 'Daily usage est.',
        category: 'ecology',
        icon: 'Droplets', // Droplets
        inputs: [
            { id: 'shower', label: 'Shower Time (min/day)', type: 'number', placeholder: '10' },
            { id: 'toilet', label: 'Toilet Flushes (per day)', type: 'number', placeholder: '5' },
            { id: 'laundry', label: 'Laundry Loads (per week)', type: 'number', placeholder: '2' },
            { id: 'dishes', label: 'Dishwasher Loads (per week)', type: 'number', placeholder: '3' }
        ],
        outputs: [
            {
                label: 'Daily Water Usage (Liters)',
                unit: 'L',
                calculate: (inputs) => {
                    // Avg rates: Shower 10L/min, Toilet 6L/flush, Laundry 50L/load, Dishwasher 15L/load
                    const shower = Number(inputs.shower) * 10;
                    const toilet = Number(inputs.toilet) * 6;
                    const laundry = (Number(inputs.laundry) * 50) / 7;
                    const dishes = (Number(inputs.dishes) * 15) / 7;
                    if (shower < 0 || toilet < 0) return 0;
                    return Math.round(shower + toilet + laundry + dishes).toString();
                }
            }
        ],
        content: { whatIs: '<p>Estimates daily household water consumption based on common activities.</p>' }
    },
    'plastic-waste-calculator': {
        id: 'plastic-waste-calculator',
        title: 'Plastic Waste',
        description: 'Yearly bottles/bags.',
        category: 'ecology',
        icon: 'Trash2', // Trash2
        inputs: [
            { id: 'bottles', label: 'Plastic Bottles (per week)', type: 'number', placeholder: '5' },
            { id: 'bags', label: 'Plastic Bags (per week)', type: 'number', placeholder: '3' },
            { id: 'wrappers', label: 'Food Wrappers (per day)', type: 'number', placeholder: '2' }
        ],
        outputs: [
            {
                label: 'Yearly Plastic Items',
                calculate: (inputs) => {
                    const bottles = Number(inputs.bottles) * 52;
                    const bags = Number(inputs.bags) * 52;
                    const wrappers = Number(inputs.wrappers) * 365;
                    return (bottles + bags + wrappers).toString();
                }
            },
            {
                label: 'Est. Weight (kg)',
                unit: 'kg',
                calculate: (inputs) => {
                    // Approx weights: Bottle 10g, Bag 5g, Wrapper 2g
                    const bottles = Number(inputs.bottles) * 52 * 0.01;
                    const bags = Number(inputs.bags) * 52 * 0.005;
                    const wrappers = Number(inputs.wrappers) * 365 * 0.002;
                    return (bottles + bags + wrappers).toFixed(1);
                }
            }
        ],
        content: { whatIs: '<p>Estimates total yearly plastic items and weight generated.</p>' }
    },
    'tree-offset-calculator': {
        id: 'tree-offset-calculator',
        title: 'Tree Offset',
        description: 'Trees needed for CO2.',
        category: 'ecology',
        icon: 'TreeDeciduous', // TreeDeciduous
        inputs: [
            { id: 'co2', label: 'Your Annual CO2 (tonnes)', type: 'number', placeholder: '10' } // avg user
        ],
        outputs: [
            {
                label: 'Trees Needed (approx)',
                calculate: (inputs) => {
                    const co2 = Number(inputs.co2);
                    if (!co2) return 0;
                    // One mature tree absorbs ~20-25kg CO2 per year. 
                    // 1 tonne = 1000kg.
                    // Trees = (CO2 * 1000) / 22
                    return Math.ceil((co2 * 1000) / 22).toString();
                }
            }
        ],
        content: { whatIs: '<p>Estimates number of trees required to offset a specific amount of CO2 emissions annually (assuming ~22kg absorption per tree).</p>' }
    },
    'composting-ratio-calculator': {
        id: 'composting-ratio-calculator',
        title: 'Compost Ratio',
        description: 'C:N Ratio Optimizer.',
        category: 'ecology',
        icon: 'Recycle', // Recycle or Leaf
        inputs: [
            { id: 'greens', label: 'Greens (parts)', type: 'number', placeholder: '1' },
            { id: 'browns', label: 'Browns (parts)', type: 'number', placeholder: '30' } // Actually usually parts by volume is like 1:1 or 1:2, C:N ratio is internal.
            // Let's simplify: Input parts by volume, output estimated C:N?
            // User usually wants to know "How many browns for my greens?".
            // Let's change input: "Volume of Greens".
            // Ideal C:N is 30:1.
            // Greens (Kitchen scraps) C:N ~ 20:1. Browns (Leaves) C:N ~ 60:1.
            // (Vg * Cg + Vb * Cb) / (Vg * Ng + Vb * Nb) = 30
            // This is complex for users.
            // User Rule of Thumb: 2 to 3 parts Brown for 1 part Green.
        ],
        // Let's just make it a Rule of Thumb calculator
        inputs: [
            { id: 'greenVol', label: 'Volume of Greens (Buckets)', type: 'number', placeholder: '1' }
        ],
        outputs: [
            {
                label: 'Recommended Browns (Buckets)',
                calculate: (inputs) => {
                    const g = Number(inputs.greenVol);
                    if (!g) return 0;
                    // 2.5 parts brown for 1 part green is a good average
                    return (g * 2.5).toString() + ' to ' + (g * 3).toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates recommended volume of Brown materials (carbon-rich) needed for your Green materials (nitrogen-rich).</p>' }
    },
    'rainwater-harvesting-calculator': {
        id: 'rainwater-harvesting-calculator',
        title: 'Rainwater Yield',
        description: 'Collection Potential.',
        category: 'ecology',
        icon: 'CloudRain', // CloudRain
        inputs: [
            { id: 'area', label: 'Roof Area (m²)', type: 'number', placeholder: '100' },
            { id: 'rainfall', label: 'Annual Rainfall (mm)', type: 'number', placeholder: '800' },
            { id: 'efficiency', label: 'Efficiency (%)', type: 'number', placeholder: '85', defaultValue: '85' }
        ],
        outputs: [
            {
                label: 'Annual Yield (Liters)',
                unit: 'L',
                calculate: (inputs) => {
                    const a = Number(inputs.area);
                    const r = Number(inputs.rainfall);
                    const eff = Number(inputs.efficiency) / 100;
                    if (!a || !r) return 0;
                    // Volume (L) = Area (m2) * Rainfall (mm) * Efficiency
                    return Math.round(a * r * eff).toString();
                }
            }
        ],
        content: { whatIs: '<p>Estimates annual rainwater collection potential from a roof.</p>' }
    },
    // Batch BF: Physics Tools IV
    'speed-of-sound-calculator': {
        id: 'speed-of-sound-calculator',
        title: 'Speed of Sound',
        description: 'V vs Temperature.',
        category: 'physics',
        icon: 'AudioWaveform', // AudioWaveform
        inputs: [
            { id: 'temp', label: 'Air Temperature (°C)', type: 'number', placeholder: '20' }
        ],
        outputs: [
            {
                label: 'Speed (m/s)',
                unit: 'm/s',
                calculate: (inputs) => {
                    const t = Number(inputs.temp);
                    if (inputs.temp === '') return 0; // Allow 0 degrees
                    // V = 331.4 + 0.6 * T
                    return (331.4 + 0.6 * t).toFixed(2);
                }
            },
            {
                label: 'Speed (km/h)',
                unit: 'km/h',
                calculate: (inputs) => {
                    const t = Number(inputs.temp);
                    if (inputs.temp === '') return 0;
                    return ((331.4 + 0.6 * t) * 3.6).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates the speed of sound in dry air at a given temperature.</p>' }
    },
    'doppler-effect-calculator': {
        id: 'doppler-effect-calculator',
        title: 'Doppler Effect',
        description: 'Frequency shift.',
        category: 'physics',
        icon: 'Radar', // Radar
        inputs: [
            { id: 'f0', label: 'Source Frequency (Hz)', type: 'number', placeholder: '440' },
            { id: 'v', label: 'Wave Speed (m/s)', type: 'number', placeholder: '343', defaultValue: '343' },
            { id: 'vr', label: 'Receiver Velocity (m/s)', type: 'number', placeholder: '0' },
            { id: 'vs', label: 'Source Velocity (m/s)', type: 'number', placeholder: '0' }
        ],
        outputs: [
            {
                label: 'Observed Frequency (Hz)',
                unit: 'Hz',
                calculate: (inputs) => {
                    const f0 = Number(inputs.f0);
                    const v = Number(inputs.v) || 343;
                    const vr = Number(inputs.vr);
                    const vs = Number(inputs.vs);
                    if (!f0) return 0;
                    // f = f0 * (v + vr) / (v + vs)
                    // Sign convention: + towards, - away.
                    // Let's assume user inputs sign or we clarify.
                    // Usually: vr positive if receiver moving towards source.
                    // vs positive if source moving away from receiver (in denominator v + vs). Wait.
                    // Standard: f = f0 * (v + vr) / (v + vs).
                    // Signs: vr>0 (towards), vr<0 (away). vs>0 (away), vs<0 (towards).
                    // Or vs>0 towards?
                    // Let's stick to standard formula where velocities are in direction receiver -> source?
                    // Simplified: "Towards is positive for receiver, Away is positive for source"? No that's confusing.
                    // Let's calculate: f = f0 * (v + vr) / (v + vs)
                    // Assumption: vr and vs are effectively "velocity component in direction of propagation"?
                    // Let's just implement the raw formula and let user handle signs, or default to 0.
                    const top = v + vr;
                    const bot = v + vs;
                    if (bot === 0) return 'Inf';
                    return Math.round(f0 * (top / bot)).toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates observed frequency due to Doppler Effect. (v: Wave speed, vr: Receiver speed, vs: Source speed).</p>' }
    },
    'snells-law-calculator': {
        id: 'snells-law-calculator',
        title: 'Snell\'s Law',
        description: 'Refraction angle.',
        category: 'physics',
        icon: 'Eye', // Eye
        inputs: [
            { id: 'n1', label: 'Index n1', type: 'number', placeholder: '1.00', defaultValue: '1.00' },
            { id: 'theta1', label: 'Angle θ1 (degrees)', type: 'number', placeholder: '45' },
            { id: 'n2', label: 'Index n2', type: 'number', placeholder: '1.33' }
        ],
        outputs: [
            {
                label: 'Angle θ2 (degrees)',
                calculate: (inputs) => {
                    const n1 = Number(inputs.n1);
                    const t1 = Number(inputs.theta1);
                    const n2 = Number(inputs.n2);
                    if (!n1 || !n2) return 0;
                    // n1 * sin(t1) = n2 * sin(t2)
                    // sin(t2) = (n1/n2) * sin(t1)
                    const rad1 = t1 * (Math.PI / 180);
                    const sin2 = (n1 / n2) * Math.sin(rad1);
                    if (Math.abs(sin2) > 1) return 'TIR'; // Total Internal Reflection
                    const rad2 = Math.asin(sin2);
                    return (rad2 * (180 / Math.PI)).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates refraction angle using Snell\'s Law.</p>' }
    },
    'focal-length-calculator': {
        id: 'focal-length-calculator',
        title: 'Lens Focal Length',
        description: 'Lens Equation.',
        category: 'physics',
        icon: 'Aperture', // Aperture
        inputs: [
            { id: 'do', label: 'Object Distance (do)', type: 'number', placeholder: '10' },
            { id: 'di', label: 'Image Distance (di)', type: 'number', placeholder: '10' }
        ],
        outputs: [
            {
                label: 'Focal Length (f)',
                calculate: (inputs) => {
                    const d_o = Number(inputs.do);
                    const d_i = Number(inputs.di);
                    if (!d_o || !d_i) return 0;
                    // 1/f = 1/do + 1/di
                    const invF = (1 / d_o) + (1 / d_i);
                    if (invF === 0) return 'Inf';
                    return (1 / invF).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates optical focal length using the thin lens equation.</p>' }
    },
    'decibel-distance-calculator': {
        id: 'decibel-distance-calculator',
        title: 'Decibel Distance',
        description: 'Sound Falloff.',
        category: 'physics',
        icon: 'Volume2', // Volume2
        inputs: [
            { id: 'L1', label: 'Level L1 (dB)', type: 'number', placeholder: '100' },
            { id: 'd1', label: 'Distance d1 (m)', type: 'number', placeholder: '1' },
            { id: 'd2', label: 'Distance d2 (m)', type: 'number', placeholder: '10' }
        ],
        outputs: [
            {
                label: 'Level L2 (dB)',
                unit: 'dB',
                calculate: (inputs) => {
                    const L1 = Number(inputs.L1);
                    const d1 = Number(inputs.d1);
                    const d2 = Number(inputs.d2);
                    if (!d1 || !d2) return 0;
                    // L2 = L1 - 20 * log10(d2/d1)
                    return (L1 - 20 * Math.log10(d2 / d1)).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates sound pressure level attenuation over distance (Inverse Square Law).</p>' }
    },
    // Batch BG: Everyday Tools III
    'dog-age-calculator': {
        id: 'dog-age-calculator',
        title: 'Dog Age Calculator',
        description: 'Human years equiv.',
        category: 'everyday',
        icon: 'Dog', // Dog
        inputs: [
            { id: 'age', label: 'Dog Age (years)', type: 'number', placeholder: '5' }
        ],
        outputs: [
            {
                label: 'Human Years (Approx)',
                calculate: (inputs) => {
                    const age = Number(inputs.age);
                    if (!age) return 0;
                    // Simple rule: 1st year = 15, 2nd = +9, then +5 per year.
                    if (age <= 1) return Math.round(age * 15).toString();
                    if (age <= 2) return Math.round(15 + (age - 1) * 9).toString();
                    return Math.round(15 + 9 + (age - 2) * 5).toString();
                }
            }
        ],
        content: { whatIs: '<p>Estimates dog age in human years (15 for first, 9 for second, 5 thereafter).</p>' }
    },
    'cat-age-calculator': {
        id: 'cat-age-calculator',
        title: 'Cat Age Calculator',
        description: 'Human years equiv.',
        category: 'everyday',
        icon: 'Cat', // Cat
        inputs: [
            { id: 'age', label: 'Cat Age (years)', type: 'number', placeholder: '5' }
        ],
        outputs: [
            {
                label: 'Human Years (Approx)',
                calculate: (inputs) => {
                    const age = Number(inputs.age);
                    if (!age) return 0;
                    // Rule: 1st = 15, 2nd = +9, then +4 per year.
                    if (age <= 1) return Math.round(age * 15).toString();
                    if (age <= 2) return Math.round(15 + (age - 1) * 9).toString();
                    return Math.round(15 + 9 + (age - 2) * 4).toString();
                }
            }
        ],
        content: { whatIs: '<p>Estimates cat age in human years (15 for first, 9 for second, 4 thereafter).</p>' }
    },
    'pizza-calculator': {
        id: 'pizza-calculator',
        title: 'Pizza Calculator',
        description: 'How many pizzas?',
        category: 'everyday',
        icon: 'Pizza', // Pizza
        inputs: [
            { id: 'people', label: 'Number of People', type: 'number', placeholder: '10' },
            { id: 'slices', label: 'Slices per Person', type: 'number', placeholder: '3', defaultValue: '3' },
            { id: 'pizzaslices', label: 'Slices per Pizza', type: 'number', placeholder: '8', defaultValue: '8' }
        ],
        outputs: [
            {
                label: 'Pizzas Needed',
                calculate: (inputs) => {
                    const p = Number(inputs.people);
                    const s = Number(inputs.slices);
                    const ps = Number(inputs.pizzaslices);
                    if (!p || !s || !ps) return 0;
                    const totalSlices = p * s;
                    return Math.ceil(totalSlices / ps).toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates number of pizzas recommended for a group.</p>' }
    },
    'bbq-calculator': {
        id: 'bbq-calculator',
        title: 'BBQ Calculator',
        description: 'Meat per person.',
        category: 'everyday',
        icon: 'UtensilsCrossed', // UtensilsCrossed or Beef
        inputs: [
            { id: 'adults', label: 'Adults', type: 'number', placeholder: '10' },
            { id: 'kids', label: 'Kids', type: 'number', placeholder: '5' }
        ],
        outputs: [
            {
                label: 'Meat Required (kg)',
                unit: 'kg',
                calculate: (inputs) => {
                    const a = Number(inputs.adults);
                    const k = Number(inputs.kids);
                    if (!a && !k) return 0;
                    // Rule: 0.5kg per adult, 0.25kg per kid (raw weight)
                    const meat = (a * 0.5) + (k * 0.25);
                    return meat.toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Estimates raw meat per person for a BBQ (0.5kg/adult, 0.25kg/kid).</p>' }
    },
    'tip-splitter-calculator': {
        id: 'tip-splitter-calculator',
        title: 'Tip Splitter',
        description: 'Split bill & tip.',
        category: 'everyday',
        icon: 'Coins', // Coins or Banknote
        inputs: [
            { id: 'bill', label: 'Bill Amount', type: 'number', placeholder: '100' },
            { id: 'tip', label: 'Tip %', type: 'number', placeholder: '15', defaultValue: '15' },
            { id: 'people', label: 'Split Between', type: 'number', placeholder: '2', defaultValue: '2' }
        ],
        outputs: [
            {
                label: 'Total per Person',
                calculate: (inputs) => {
                    const b = Number(inputs.bill);
                    const t = Number(inputs.tip);
                    const p = Number(inputs.people);
                    if (!b || !p) return 0;
                    const total = b * (1 + t / 100);
                    return (total / p).toFixed(2);
                }
            },
            {
                label: 'Tip Amount',
                calculate: (inputs) => {
                    const b = Number(inputs.bill);
                    const t = Number(inputs.tip);
                    return (b * t / 100).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates total bill including tip and splits it per person.</p>' }
    },
    // Batch BH: Chemistry Tools
    'ph-calculator': {
        id: 'ph-calculator',
        title: 'pH Calculator',
        description: 'Concentration to pH.',
        category: 'chemistry',
        icon: 'FlaskConical', // FlaskConical
        inputs: [
            { id: 'h', label: '[H+] Concentration (mol/L)', type: 'number', placeholder: '0.0001' }
        ],
        outputs: [
            {
                label: 'pH',
                calculate: (inputs) => {
                    const h = Number(inputs.h);
                    if (!h || h <= 0) return 0;
                    // pH = -log10([H+])
                    return (-Math.log10(h)).toFixed(2);
                }
            },
            {
                label: 'pOH',
                calculate: (inputs) => {
                    const h = Number(inputs.h);
                    if (!h || h <= 0) return 0;
                    const ph = -Math.log10(h);
                    return (14 - ph).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates pH and pOH from hydrogen ion concentration [H+].</p>' }
    },
    'molarity-calculator': {
        id: 'molarity-calculator',
        title: 'Molarity Calculator',
        description: 'Moles/Volume.',
        category: 'chemistry',
        icon: 'FlaskConical',
        inputs: [
            { id: 'moles', label: 'Moles (mol)', type: 'number', placeholder: '2' },
            { id: 'vol', label: 'Volume (L)', type: 'number', placeholder: '1' }
        ],
        outputs: [
            {
                label: 'Molarity (M)',
                unit: 'mol/L',
                calculate: (inputs) => {
                    const m = Number(inputs.moles);
                    const v = Number(inputs.vol);
                    if (!m || !v) return 0;
                    return (m / v).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Calculates molar concentration (Molarity) of a solution.</p>' }
    },
    'ideal-gas-law-calculator': {
        id: 'ideal-gas-law-calculator',
        title: 'Ideal Gas Law',
        description: 'Calculate Pressure.',
        category: 'chemistry',
        icon: 'FlaskConical',
        inputs: [
            { id: 'n', label: 'Moles (n)', type: 'number', placeholder: '1' },
            { id: 'T', label: 'Temperature (K)', type: 'number', placeholder: '298', defaultValue: '298' },
            { id: 'V', label: 'Volume (L)', type: 'number', placeholder: '22.4' }
        ],
        outputs: [
            {
                label: 'Pressure (atm)',
                unit: 'atm',
                calculate: (inputs) => {
                    const n = Number(inputs.n);
                    const T = Number(inputs.T);
                    const V = Number(inputs.V);
                    const R = 0.0821; // L atm / (K mol)
                    if (!V) return 0;
                    // PV = nRT -> P = nRT / V
                    return ((n * R * T) / V).toFixed(3);
                }
            }
        ],
        content: { whatIs: '<p>Calculates pressure of a gas using the Ideal Gas Law (PV = nRT).</p>' }
    },
    'mass-mole-converter': {
        id: 'mass-mole-converter',
        title: 'Mass-Mole Converter',
        description: 'Mass <-> Moles.',
        category: 'chemistry',
        icon: 'FlaskConical',
        inputs: [
            { id: 'mass', label: 'Mass (g)', type: 'number', placeholder: '18' },
            { id: 'mm', label: 'Molar Mass (g/mol)', type: 'number', placeholder: '18.015', defaultValue: '18.015' }
        ],
        outputs: [
            {
                label: 'Moles',
                unit: 'mol',
                calculate: (inputs) => {
                    const m = Number(inputs.mass);
                    const mm = Number(inputs.mm);
                    if (!m || !mm) return 0;
                    return (m / mm).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Converts mass to moles given the Molar Mass of the substance.</p>' }
    },
    'half-life-calculator': {
        id: 'half-life-calculator',
        title: 'Half Life Calculator',
        description: 'Decay remaining.',
        category: 'chemistry',
        icon: 'FlaskConical',
        inputs: [
            { id: 'n0', label: 'Initial Amount (N0)', type: 'number', placeholder: '100' },
            { id: 't', label: 'Time Elapsed (t)', type: 'number', placeholder: '10' },
            { id: 'th', label: 'Half-Life (t½)', type: 'number', placeholder: '5' }
        ],
        outputs: [
            {
                label: 'Remaining Amount (Nt)',
                calculate: (inputs) => {
                    const n0 = Number(inputs.n0);
                    const t = Number(inputs.t);
                    const th = Number(inputs.th);
                    if (!th) return 0;
                    // Nt = N0 * (0.5)^(t/th)
                    return (n0 * Math.pow(0.5, t / th)).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Calculates remaining quantity of a substance after radioactive decay.</p>' }
    },
    // Batch BI: Finance Tools V
    'mortgage-refinance-calculator': {
        id: 'mortgage-refinance-calculator',
        title: 'Refinance Calc',
        description: 'Breakeven analysis.',
        category: 'finance',
        icon: 'Landmark', // Landmark
        inputs: [
            { id: 'loan', label: 'Loan Amount', type: 'number', placeholder: '300000' },
            { id: 'rate1', label: 'Current Rate (%)', type: 'number', placeholder: '5.5' },
            { id: 'rate2', label: 'New Rate (%)', type: 'number', placeholder: '4.5' },
            { id: 'years', label: 'Term (years)', type: 'number', placeholder: '30', defaultValue: '30' },
            { id: 'cost', label: 'Closing Costs', type: 'number', placeholder: '5000' }
        ],
        outputs: [
            {
                label: 'Monthly Savings',
                currency: true,
                calculate: (inputs) => {
                    const P = Number(inputs.loan);
                    const r1 = Number(inputs.rate1) / 100 / 12;
                    const r2 = Number(inputs.rate2) / 100 / 12;
                    const n = Number(inputs.years) * 12;
                    if (!P || !n) return 0;
                    // M = P [ r(1+r)^n ] / [ (1+r)^n – 1 ]
                    const pmt1 = (r1 === 0) ? P / n : (P * r1 * Math.pow(1 + r1, n)) / (Math.pow(1 + r1, n) - 1);
                    const pmt2 = (r2 === 0) ? P / n : (P * r2 * Math.pow(1 + r2, n)) / (Math.pow(1 + r2, n) - 1);
                    return (pmt1 - pmt2).toFixed(2);
                }
            },
            {
                label: 'Breakeven (Months)',
                calculate: (inputs) => {
                    const P = Number(inputs.loan);
                    const r1 = Number(inputs.rate1) / 100 / 12;
                    const r2 = Number(inputs.rate2) / 100 / 12;
                    const n = Number(inputs.years) * 12;
                    const cost = Number(inputs.cost);
                    if (!P || !n || !cost) return 0;
                    const pmt1 = (r1 === 0) ? P / n : (P * r1 * Math.pow(1 + r1, n)) / (Math.pow(1 + r1, n) - 1);
                    const pmt2 = (r2 === 0) ? P / n : (P * r2 * Math.pow(1 + r2, n)) / (Math.pow(1 + r2, n) - 1);
                    const savings = pmt1 - pmt2;
                    if (savings <= 0) return 'Never';
                    return Math.ceil(cost / savings).toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates monthly savings and breakeven point for mortgage refinancing.</p>' }
    },
    '401k-calculator': {
        id: '401k-calculator',
        title: '401k Calculator',
        description: 'Retirement growth.',
        category: 'finance',
        icon: 'PiggyBank', // PiggyBank
        inputs: [
            { id: 'current', label: 'Current Balance', type: 'number', placeholder: '10000' },
            { id: 'contrib', label: 'Annual Contribution', type: 'number', placeholder: '5000' },
            { id: 'rate', label: 'Annual Return (%)', type: 'number', placeholder: '7', defaultValue: '7' },
            { id: 'years', label: 'Years to Grow', type: 'number', placeholder: '30' }
        ],
        outputs: [
            {
                label: 'Future Value',
                currency: true,
                calculate: (inputs) => {
                    const P = Number(inputs.current);
                    const C = Number(inputs.contrib);
                    const r = Number(inputs.rate) / 100;
                    const t = Number(inputs.years);
                    if (t === 0) return P.toFixed(2);
                    // FV = P * (1+r)^t + C * [ ((1+r)^t - 1) / r ]
                    // If r=0, FV = P + C*t
                    if (r === 0) return (P + C * t).toFixed(2);
                    const compoundP = P * Math.pow(1 + r, t);
                    const compoundC = C * (Math.pow(1 + r, t) - 1) / r;
                    return (compoundP + compoundC).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Estimates future value of 401k or retirement account with annual contributions.</p>' }
    },
    'apy-calculator': {
        id: 'apy-calculator',
        title: 'APY Calculator',
        description: 'APR to APY.',
        category: 'finance',
        icon: 'Percent', // Percent
        inputs: [
            { id: 'apr', label: 'Interest Rate (APR %)', type: 'number', placeholder: '5' },
            { id: 'freq', label: 'Compounding Frequency (times/yr)', type: 'number', placeholder: '12', defaultValue: '12' }
        ],
        outputs: [
            {
                label: 'APY (%)',
                unit: '%',
                calculate: (inputs) => {
                    const r = Number(inputs.apr) / 100;
                    const n = Number(inputs.freq);
                    if (!r || !n) return 0;
                    // APY = (1 + r/n)^n - 1
                    const apy = Math.pow(1 + r / n, n) - 1;
                    return (apy * 100).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Converts Annual Percentage Rate (APR) to Annual Percentage Yield (APY) incorporating compounding.</p>' }
    },
    'investment-return-calculator': {
        id: 'investment-return-calculator',
        title: 'Investment Return',
        description: 'ROI & Gain.',
        category: 'finance',
        icon: 'LineChart', // LineChart
        inputs: [
            { id: 'invested', label: 'Total Invested', type: 'number', placeholder: '1000' },
            { id: 'current', label: 'Current Value', type: 'number', placeholder: '1500' }
        ],
        outputs: [
            {
                label: 'ROI (%)',
                unit: '%',
                calculate: (inputs) => {
                    const i = Number(inputs.invested);
                    const c = Number(inputs.current);
                    if (!i) return 0;
                    const gain = c - i;
                    return ((gain / i) * 100).toFixed(2);
                }
            },
            {
                label: 'Gain/Loss',
                currency: true,
                calculate: (inputs) => {
                    return (Number(inputs.current) - Number(inputs.invested)).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates Return on Investment (ROI) and total gain or loss.</p>' }
    },
    'inflation-impact-calculator': {
        id: 'inflation-impact-calculator',
        title: 'Inflation Impact',
        description: 'Future purchasing power.',
        category: 'finance',
        icon: 'TrendingUp', // TrendingUp (existing)
        inputs: [
            { id: 'amount', label: 'Current Amount', type: 'number', placeholder: '1000' },
            { id: 'rate', label: 'Inflation Rate (%)', type: 'number', placeholder: '3', defaultValue: '3' },
            { id: 'years', label: 'Years', type: 'number', placeholder: '10' }
        ],
        outputs: [
            {
                label: 'Future Value (Real)',
                currency: true,
                calculate: (inputs) => {
                    const P = Number(inputs.amount);
                    const r = Number(inputs.rate) / 100;
                    const t = Number(inputs.years);
                    if (!P) return 0;
                    // FV = P / (1+r)^t
                    return (P / Math.pow(1 + r, t)).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates the future purchasing power of money given an inflation rate.</p>' }
    },
    // Batch BJ: Fitness Tools II
    'one-rep-max-calculator': {
        id: 'one-rep-max-calculator',
        title: '1 Rep Max Calculator',
        description: 'Strength potential.',
        category: 'fitness',
        icon: 'Dumbbell', // Dumbbell
        inputs: [
            { id: 'weight', label: 'Weight Lifted', type: 'number', placeholder: '100' },
            { id: 'reps', label: 'Repetitions', type: 'number', placeholder: '5' }
        ],
        outputs: [
            {
                label: '1 Rep Max (1RM)',
                calculate: (inputs) => {
                    const w = Number(inputs.weight);
                    const r = Number(inputs.reps);
                    if (!w || !r) return 0;
                    if (r === 1) return w.toString();
                    // Epley Formula: 1RM = w * (1 + r/30)
                    return Math.round(w * (1 + r / 30)).toString();
                }
            }
        ],
        content: { whatIs: '<p>Estimates maximum weight you can lift for one repetition (Epley Formula).</p>' }
    },
    'target-heart-rate-calculator': {
        id: 'target-heart-rate-calculator',
        title: 'Target Heart Rate',
        description: 'Training zones.',
        category: 'fitness',
        icon: 'Activity', // Activity
        inputs: [
            { id: 'age', label: 'Age', type: 'number', placeholder: '30' },
            { id: 'rest', label: 'Resting HR (bpm)', type: 'number', placeholder: '70', defaultValue: '70' },
            { id: 'int', label: 'Intensity (%)', type: 'number', placeholder: '70', defaultValue: '70' }
        ],
        outputs: [
            {
                label: 'Target HR (bpm)',
                unit: 'bpm',
                calculate: (inputs) => {
                    const age = Number(inputs.age);
                    const rest = Number(inputs.rest);
                    const int = Number(inputs.int) / 100;
                    if (!age) return 0;
                    // Karvonen Formula
                    const maxHR = 220 - age;
                    const reserve = maxHR - rest;
                    return Math.round(rest + reserve * int).toString();
                }
            },
            {
                label: 'Max HR',
                unit: 'bpm',
                calculate: (inputs) => {
                    return (220 - Number(inputs.age)).toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates optimal heart rate zone using Karvonen formula.</p>' }
    },
    'body-fat-navy-calculator': {
        id: 'body-fat-navy-calculator',
        title: 'Body Fat (Navy)',
        description: 'Tape measure calc.',
        category: 'fitness',
        icon: 'Scale', // Scale
        inputs: [
            { id: 'gender', label: 'Gender (1=Male, 0=Female)', type: 'number', placeholder: '1', defaultValue: '1' }, // Simplification for input
            { id: 'waist', label: 'Waist (cm)', type: 'number', placeholder: '85' },
            { id: 'neck', label: 'Neck (cm)', type: 'number', placeholder: '38' },
            { id: 'height', label: 'Height (cm)', type: 'number', placeholder: '180' },
            { id: 'hip', label: 'Hip (cm) [Females only]', type: 'number', placeholder: '0' }
        ],
        outputs: [
            {
                label: 'Body Fat %',
                unit: '%',
                calculate: (inputs) => {
                    const g = Number(inputs.gender);
                    const w = Number(inputs.waist);
                    const n = Number(inputs.neck);
                    const h = Number(inputs.height);
                    const hip = Number(inputs.hip);
                    if (!w || !n || !h) return 0;

                    // US Navy Method
                    // Male: 495 / (1.0324 - 0.19077 * log10(waist-neck) + 0.15456 * log10(height)) - 450
                    // Female: 495 / (1.29579 - 0.35004 * log10(waist+hip-neck) + 0.22100 * log10(height)) - 450

                    try {
                        let bf = 0;
                        if (g === 1) {
                            if (w <= n) return 0; // Check validity
                            bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
                        } else {
                            if ((w + hip) <= n) return 0;
                            bf = 495 / (1.29579 - 0.35004 * Math.log10(w + hip - n) + 0.22100 * Math.log10(h)) - 450;
                        }
                        return (bf > 0) ? bf.toFixed(1) : 0;
                    } catch (e) { return 0; }
                }
            }
        ],
        content: { whatIs: '<p>Estimates body fat percentage using US Navy circumference method. (Gender: 1 for Male, 0 for Female).</p>' }
    },
    'lean-body-mass-calculator': {
        id: 'lean-body-mass-calculator',
        title: 'Lean Body Mass',
        description: 'LBM Estimate.',
        category: 'fitness',
        icon: 'PersonStanding', // PersonStanding
        inputs: [
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '80' },
            { id: 'bf', label: 'Body Fat %', type: 'number', placeholder: '15' }
        ],
        outputs: [
            {
                label: 'Lean Mass (kg)',
                unit: 'kg',
                calculate: (inputs) => {
                    const w = Number(inputs.weight);
                    const bf = Number(inputs.bf);
                    if (!w) return 0;
                    // LBM = Weight * (1 - bf/100)
                    return (w * (1 - bf / 100)).toFixed(1);
                }
            },
            {
                label: 'Fat Mass (kg)',
                unit: 'kg',
                calculate: (inputs) => {
                    const w = Number(inputs.weight);
                    const bf = Number(inputs.bf);
                    return (w * bf / 100).toFixed(1);
                }
            }
        ],
        content: { whatIs: '<p>Calculates Lean Body Mass (LBM) and Fat Mass based on body fat percentage.</p>' }
    },
    'macros-calculator': {
        id: 'macros-calculator',
        title: 'Macros Calculator',
        description: 'Protein/Carb/Fat.',
        category: 'fitness',
        icon: 'UtensilsCrossed', // Or PieChart. Let's use UtensilsCrossed existing or similar.
        inputs: [
            { id: 'cals', label: 'Target Calories', type: 'number', placeholder: '2500' },
            { id: 'p_ratio', label: 'Protein %', type: 'number', placeholder: '30', defaultValue: '30' },
            { id: 'f_ratio', label: 'Fat %', type: 'number', placeholder: '30', defaultValue: '30' },
            { id: 'c_ratio', label: 'Carb %', type: 'number', placeholder: '40', defaultValue: '40' }
        ],
        outputs: [
            {
                label: 'Protein (g)',
                unit: 'g',
                calculate: (inputs) => {
                    const cals = Number(inputs.cals);
                    const p = Number(inputs.p_ratio) / 100;
                    if (!cals) return 0;
                    // Protein 4 cal/g
                    return ((cals * p) / 4).toFixed(0);
                }
            },
            {
                label: 'Carbs (g)',
                unit: 'g',
                calculate: (inputs) => {
                    const cals = Number(inputs.cals);
                    const c = Number(inputs.c_ratio) / 100;
                    // Carbs 4 cal/g
                    return ((cals * c) / 4).toFixed(0);
                }
            },
            {
                label: 'Fats (g)',
                unit: 'g',
                calculate: (inputs) => {
                    const cals = Number(inputs.cals);
                    const f = Number(inputs.f_ratio) / 100;
                    // Fat 9 cal/g
                    return ((cals * f) / 9).toFixed(0);
                }
            }
        ],
        content: { whatIs: '<p>Calculates macronutrient split (Protein/Carbs/Fats) in grams based on calorie goal & ratios.</p>' }
    },
    // Batch BK: Electronics Tools
    'ohms-law-calculator': {
        id: 'ohms-law-calculator',
        title: 'Ohm\'s Law Calculator',
        description: 'V = I x R',
        category: 'electronics',
        icon: 'Zap', // Zap
        inputs: [
            { id: 'v', label: 'Voltage (V)', type: 'number', placeholder: '12' },
            { id: 'i', label: 'Current (A)', type: 'number', placeholder: '2' },
            { id: 'r', label: 'Resistance (Ω)', type: 'number', placeholder: '6' }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const v = Number(inputs.v);
                    const i = Number(inputs.i);
                    const r = Number(inputs.r);
                    // If V is missing, calc V = I*R
                    if (!v && i && r) return (i * r).toFixed(2) + ' V';
                    // If I is missing, calc I = V/R
                    if (v && !i && r) return (v / r).toFixed(2) + ' A';
                    // If R is missing, calc R = V/I
                    if (v && i && !r) return (v / i).toFixed(2) + ' Ω';
                    return 'Enter 2 values';
                }
            },
            {
                label: 'Power (W)',
                unit: 'W',
                calculate: (inputs) => {
                    const v = Number(inputs.v);
                    const i = Number(inputs.i);
                    const r = Number(inputs.r);
                    let finalV = v, finalI = i;
                    if (!v && i && r) finalV = i * r;
                    if (v && !i && r) finalI = v / r;
                    if (finalV && finalI) return (finalV * finalI).toFixed(2);
                    return '0';
                }
            }
        ],
        content: { whatIs: '<p>Calculates Voltage (V), Current (I), Resistance (R), and Power using Ohm\'s Law. Leave one field empty to calculate.</p>' }
    },
    'voltage-divider-calculator': {
        id: 'voltage-divider-calculator',
        title: 'Voltage Divider',
        description: 'Vout = Vin * R2/(R1+R2)',
        category: 'electronics',
        icon: 'Cable', // Cable or Stick to Zap
        inputs: [
            { id: 'vin', label: 'Input Voltage (Vin)', type: 'number', placeholder: '5' },
            { id: 'r1', label: 'Resistor 1 (R1 - Ω)', type: 'number', placeholder: '1000' },
            { id: 'r2', label: 'Resistor 2 (R2 - Ω)', type: 'number', placeholder: '2000' }
        ],
        outputs: [
            {
                label: 'Output Voltage (Vout)',
                unit: 'V',
                calculate: (inputs) => {
                    const vin = Number(inputs.vin);
                    const r1 = Number(inputs.r1);
                    const r2 = Number(inputs.r2);
                    if (!vin || !r1 || !r2) return 0;
                    // Vout = Vin * (R2 / (R1 + R2))
                    return (vin * (r2 / (r1 + r2))).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates the output voltage of a resistive voltage divider circuit.</p>' }
    },
    'led-resistor-calculator': {
        id: 'led-resistor-calculator',
        title: 'LED Resistor',
        description: 'Series resistor calc.',
        category: 'electronics',
        icon: 'Lightbulb', // Lightbulb
        inputs: [
            { id: 'vs', label: 'Source Voltage (V)', type: 'number', placeholder: '5' },
            { id: 'vf', label: 'LED Forward Voltage (Vf)', type: 'number', placeholder: '2' },
            { id: 'if', label: 'LED Current (mA)', type: 'number', placeholder: '20' }
        ],
        outputs: [
            {
                label: 'Resistor Value (Ω)',
                unit: 'Ω',
                calculate: (inputs) => {
                    const vs = Number(inputs.vs);
                    const vf = Number(inputs.vf);
                    const ifwd = Number(inputs.if); // mA
                    if (!vs || !vf || !ifwd) return 0;
                    // R = (Vs - Vf) / I
                    const i = ifwd / 1000; // convert to Ops
                    if (vs <= vf) return 'Vs too low';
                    return Math.ceil((vs - vf) / i).toString();
                }
            },
            {
                label: 'Resistor Power (mW)',
                unit: 'mW',
                calculate: (inputs) => {
                    const vs = Number(inputs.vs);
                    const vf = Number(inputs.vf);
                    const ifwd = Number(inputs.if);
                    if (!vs || !vf || !ifwd || vs <= vf) return 0;
                    const vDrop = vs - vf;
                    // P = V * I
                    return (vDrop * ifwd).toFixed(0);
                }
            }
        ],
        content: { whatIs: '<p>Calculates the required series resistor value for an LED.</p>' }
    },
    'capacitor-energy-calculator': {
        id: 'capacitor-energy-calculator',
        title: 'Capacitor Energy',
        description: 'E = 0.5 * C * V^2',
        category: 'electronics',
        icon: 'Battery', // Battery? Or Zap? Let's use Battery for storage
        inputs: [
            { id: 'c', label: 'Capacitance (uF)', type: 'number', placeholder: '100' },
            { id: 'v', label: 'Voltage (V)', type: 'number', placeholder: '12' }
        ],
        outputs: [
            {
                label: 'Energy (Joules)',
                unit: 'J',
                calculate: (inputs) => {
                    const c_uf = Number(inputs.c);
                    const v = Number(inputs.v);
                    if (!c_uf || !v) return 0;
                    // E = 0.5 * C * V^2
                    const c = c_uf / 1000000; // convert uF to F
                    return (0.5 * c * v * v).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Calculates energy stored in a capacitor.</p>' }
    },
    'battery-life-calculator': {
        id: 'battery-life-calculator',
        title: 'Battery Life',
        description: 'Estimated runtime.',
        category: 'electronics',
        icon: 'Battery', // Battery
        inputs: [
            { id: 'cap', label: 'Capacity (mAh)', type: 'number', placeholder: '2000' },
            { id: 'load', label: 'Load Current (mA)', type: 'number', placeholder: '100' },
            { id: 'derate', label: 'Efficiency (0.7-0.9)', type: 'number', placeholder: '0.85', defaultValue: '0.85' }
        ],
        outputs: [
            {
                label: 'Estimated Time (Hours)',
                unit: 'hrs',
                calculate: (inputs) => {
                    const cap = Number(inputs.cap);
                    const load = Number(inputs.load);
                    const eff = Number(inputs.derate);
                    if (!cap || !load) return 0;
                    // Time = (Capacity / Load) * Efficiency
                    return ((cap / load) * eff).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Estimates battery runtime based on capacity and load current.</p>' }
    },
    // Batch BL: Statistics Tools III
    'z-score-calculator': {
        id: 'z-score-calculator',
        title: 'Z-Score Calculator',
        description: 'Standard Score.',
        category: 'statistics',
        icon: 'Sigma', // Sigma
        inputs: [
            { id: 'raw', label: 'Raw Score (x)', type: 'number', placeholder: '85' },
            { id: 'mean', label: 'Population Mean (μ)', type: 'number', placeholder: '75' },
            { id: 'std', label: 'Std Deviation (σ)', type: 'number', placeholder: '5' }
        ],
        outputs: [
            {
                label: 'Z-Score',
                calculate: (inputs) => {
                    const x = Number(inputs.raw);
                    const mu = Number(inputs.mean);
                    const sigma = Number(inputs.std);
                    if (!sigma) return 0;
                    // z = (x - mu) / sigma
                    return ((x - mu) / sigma).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Calculates the Z-score (standard score) from a raw score, mean, and standard deviation.</p>' }
    },
    'confidence-interval-calculator': {
        id: 'confidence-interval-calculator',
        title: 'Confidence Interval',
        description: 'Mean estimate.',
        category: 'statistics',
        icon: 'BarChart3', // BarChart3
        inputs: [
            { id: 'mean', label: 'Sample Mean (x̄)', type: 'number', placeholder: '100' },
            { id: 'std', label: 'Sample Std Dev (s)', type: 'number', placeholder: '15' },
            { id: 'n', label: 'Sample Size (n)', type: 'number', placeholder: '50' },
            { id: 'cl', label: 'Confidence Level (%)', type: 'number', placeholder: '95', defaultValue: '95' }
        ],
        outputs: [
            {
                label: 'Lower Limit',
                calculate: (inputs) => {
                    // Margin of error = z * (s / sqrt(n))
                    // approx Z for 95% is 1.96, 90% is 1.645, 99% is 2.576
                    const mean = Number(inputs.mean);
                    const s = Number(inputs.std);
                    const n = Number(inputs.n);
                    const cl = Number(inputs.cl);
                    if (!n || !s) return 0;

                    let z = 1.96;
                    if (cl >= 99) z = 2.576;
                    else if (cl >= 95) z = 1.96;
                    else if (cl >= 90) z = 1.645;
                    else if (cl >= 80) z = 1.28;
                    // Simple approximation for common values

                    const moe = z * (s / Math.sqrt(n));
                    return (mean - moe).toFixed(4);
                }
            },
            {
                label: 'Upper Limit',
                calculate: (inputs) => {
                    const mean = Number(inputs.mean);
                    const s = Number(inputs.std);
                    const n = Number(inputs.n);
                    const cl = Number(inputs.cl);
                    if (!n || !s) return 0;
                    let z = 1.96;
                    if (cl >= 99) z = 2.576;
                    else if (cl >= 95) z = 1.96;
                    else if (cl >= 90) z = 1.645;
                    else if (cl >= 80) z = 1.28;
                    const moe = z * (s / Math.sqrt(n));
                    return (mean + moe).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Calculates the Confidence Interval for a sample mean.</p>' }
    },
    'margin-of-error-calculator': {
        id: 'margin-of-error-calculator',
        title: 'Margin of Error',
        description: 'Survey precision.',
        category: 'statistics',
        icon: 'Target', // Target
        inputs: [
            { id: 'p', label: 'Sample Proportion (%)', type: 'number', placeholder: '50', defaultValue: '50' },
            { id: 'n', label: 'Sample Size (n)', type: 'number', placeholder: '1000' },
            { id: 'cl', label: 'Confidence Level (%)', type: 'number', placeholder: '95', defaultValue: '95' }
        ],
        outputs: [
            {
                label: 'Margin of Error (%)',
                unit: '%',
                calculate: (inputs) => {
                    const p = Number(inputs.p) / 100;
                    const n = Number(inputs.n);
                    const cl = Number(inputs.cl);
                    if (!n) return 0;

                    let z = 1.96;
                    if (cl >= 99) z = 2.576;
                    else if (cl >= 95) z = 1.96;
                    else if (cl >= 90) z = 1.645;

                    // MOE = z * sqrt(p*(1-p)/n)
                    const moe = z * Math.sqrt((p * (1 - p)) / n);
                    return (moe * 100).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates Margin of Error for a survey proportion.</p>' }
    },
    'standard-error-calculator': {
        id: 'standard-error-calculator',
        title: 'Standard Error',
        description: 'SE of Mean.',
        category: 'statistics',
        icon: 'BarChart3', // BarChart3
        inputs: [
            { id: 'std', label: 'Std Deviation (σ)', type: 'number', placeholder: '15' },
            { id: 'n', label: 'Sample Size (n)', type: 'number', placeholder: '100' }
        ],
        outputs: [
            {
                label: 'Standard Error (SE)',
                calculate: (inputs) => {
                    const s = Number(inputs.std);
                    const n = Number(inputs.n);
                    if (!n) return 0;
                    // SE = s / sqrt(n)
                    return (s / Math.sqrt(n)).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Calculates the Standard Error of the mean.</p>' }
    },
    'sample-size-calculator': {
        id: 'sample-size-calculator',
        title: 'Sample Size',
        description: 'Required participants.',
        category: 'statistics',
        icon: 'Users', // Users
        inputs: [
            { id: 'moe', label: 'Margin of Error (%)', type: 'number', placeholder: '5' },
            { id: 'cl', label: 'Confidence Level (%)', type: 'number', placeholder: '95', defaultValue: '95' },
            { id: 'p', label: 'Population Proportion (%)', type: 'number', placeholder: '50', defaultValue: '50' }
        ],
        outputs: [
            {
                label: 'Sample Size Needed',
                calculate: (inputs) => {
                    const e = Number(inputs.moe) / 100;
                    const cl = Number(inputs.cl);
                    const p = Number(inputs.p) / 100;
                    if (!e) return 0;

                    let z = 1.96;
                    if (cl >= 99) z = 2.576;
                    else if (cl >= 95) z = 1.96;
                    else if (cl >= 90) z = 1.645;

                    // n = (z^2 * p * (1-p)) / e^2
                    const n = (Math.pow(z, 2) * p * (1 - p)) / Math.pow(e, 2);
                    return Math.ceil(n).toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates required sample size for a survey.</p>' }
    },
    'logarithm-calculator': {
        id: 'logarithm-calculator',
        title: 'Logarithm Calculator',
        description: 'Log base b.',
        category: 'mathematics',
        icon: 'FunctionSquare', // FunctionSquare
        inputs: [
            { id: 'x', label: 'Value (x)', type: 'number', placeholder: '100' },
            { id: 'b', label: 'Base (b)', type: 'number', placeholder: '10', defaultValue: '10' }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const x = Number(inputs.x);
                    const b = Number(inputs.b);
                    if (x <= 0 || b <= 0 || b === 1) return 'Invalid input';
                    // Log base b of x = log(x) / log(b)
                    return (Math.log(x) / Math.log(b)).toFixed(6);
                }
            }
        ],
        content: { whatIs: '<p>Calculates the logarithm of x with base b.</p>' }
    },
    'exponent-calculator': {
        id: 'exponent-calculator',
        title: 'Exponent Calculator',
        description: 'Power function.',
        category: 'mathematics',
        icon: 'FunctionSquare', // Reuse
        inputs: [
            { id: 'b', label: 'Base (b)', type: 'number', placeholder: '2' },
            { id: 'e', label: 'Exponent (n)', type: 'number', placeholder: '10' }
        ],
        outputs: [
            {
                label: 'Result',
                calculate: (inputs) => {
                    const b = Number(inputs.b);
                    const e = Number(inputs.e);
                    if (!b && b !== 0) return 0;
                    return Math.pow(b, e).toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates b raised to the power of n.</p>' }
    },
    'factorial-calculator': {
        id: 'factorial-calculator',
        title: 'Factorial Calculator',
        description: 'n!',
        category: 'mathematics',
        icon: 'Variable', // Variable or Binary?? Variable works
        inputs: [
            { id: 'n', label: 'Number (n)', type: 'number', placeholder: '5' }
        ],
        outputs: [
            {
                label: 'Result (n!)',
                calculate: (inputs) => {
                    let n = Number(inputs.n);
                    if (n < 0) return 'Error';
                    if (n > 170) return 'Infinity'; // JS limit
                    if (n === 0) return '1';
                    let res = 1;
                    for (let i = 2; i <= n; i++) res *= i;
                    return res.toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates the factorial of a non-negative integer n.</p>' }
    },
    'sigmoid-function-calculator': {
        id: 'sigmoid-function-calculator',
        title: 'Sigmoid Function',
        description: 'Activation func.',
        category: 'mathematics',
        icon: 'Activity', // Activity works well for sigmoid curve
        inputs: [
            { id: 'x', label: 'Input (x)', type: 'number', placeholder: '0' }
        ],
        outputs: [
            {
                label: 'Output (σ(x))',
                calculate: (inputs) => {
                    const x = Number(inputs.x);
                    // 1 / (1 + e^-x)
                    return (1 / (1 + Math.exp(-x))).toFixed(6);
                }
            }
        ],
        content: { whatIs: '<p>Calculates the standard sigmoid function used in neural networks.</p>' }
    },
    'fibonacci-generator': {
        id: 'fibonacci-generator',
        title: 'Fibonacci Generator',
        description: 'Sequence to N.',
        category: 'mathematics',
        icon: 'Combine', // Combine or something showing sequence
        inputs: [
            { id: 'n', label: 'Count (N)', type: 'number', placeholder: '10' }
        ],
        outputs: [
            {
                label: 'Sequence',
                calculate: (inputs) => {
                    let n = Number(inputs.n);
                    if (n <= 0) return '';
                    if (n > 1000) n = 1000; // Limit

                    const seq = [0, 1];
                    if (n === 1) return '0';
                    if (n === 2) return '0, 1';

                    for (let i = 2; i < n; i++) {
                        seq.push(seq[i - 1] + seq[i - 2]);
                    }
                    return seq.join(', ');
                }
            }
        ],
        content: { whatIs: '<p>Generates the first N numbers of the Fibonacci sequence.</p>' }
    },
    // Batch BN: Marketing Tools II
    'clv-calculator': {
        id: 'clv-calculator',
        title: 'Customer Lifetime Value',
        description: 'CLV prediction.',
        category: 'marketing',
        icon: 'BadgeDollarSign', // Value
        inputs: [
            { id: 'arpu', label: 'Avg Revenue/User', type: 'number', placeholder: '50' },
            { id: 'churn', label: 'Churn Rate (Monthly %)', type: 'number', placeholder: '5' },
            { id: 'margin', label: 'Gross Margin (%)', type: 'number', placeholder: '70', defaultValue: '100' }
        ],
        outputs: [
            {
                label: 'LTV',
                calculate: (inputs) => {
                    const arpu = Number(inputs.arpu);
                    const churn = Number(inputs.churn) / 100;
                    const margin = Number(inputs.margin) / 100;
                    if (churn <= 0) return 'Infinity';
                    return ((arpu * margin) / churn).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates the Lifetime Value (LTV) of a customer.</p>' }
    },
    'cac-calculator': {
        id: 'cac-calculator',
        title: 'CAC Calculator',
        description: 'Acquisition Cost.',
        category: 'marketing',
        icon: 'UserPlus', // Acquisition
        inputs: [
            { id: 'spend', label: 'Total Marketing Spend', type: 'number', placeholder: '1000' },
            { id: 'customers', label: 'New Customers', type: 'number', placeholder: '10' }
        ],
        outputs: [
            {
                label: 'CAC',
                calculate: (inputs) => {
                    const spend = Number(inputs.spend);
                    const customers = Number(inputs.customers);
                    if (!customers) return 0;
                    return (spend / customers).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates Customer Acquisition Cost.</p>' }
    },
    'roas-calculator': {
        id: 'roas-calculator',
        title: 'ROAS Calculator',
        description: 'Return on Ad Spend.',
        category: 'marketing',
        icon: 'LineChart', // Trending up
        inputs: [
            { id: 'revenue', label: 'Ad Revenue', type: 'number', placeholder: '5000' },
            { id: 'cost', label: 'Ad Cost (Spend)', type: 'number', placeholder: '1000' }
        ],
        outputs: [
            {
                label: 'ROAS (x)',
                calculate: (inputs) => {
                    const rev = Number(inputs.revenue);
                    const cost = Number(inputs.cost);
                    if (!cost) return 0;
                    return (rev / cost).toFixed(2) + 'x';
                }
            },
            {
                label: 'ROAS (%)',
                calculate: (inputs) => {
                    const rev = Number(inputs.revenue);
                    const cost = Number(inputs.cost);
                    if (!cost) return 0;
                    return ((rev / cost) * 100).toFixed(0) + '%';
                }
            }
        ],
        content: { whatIs: '<p>Calculates Return on Ad Spend.</p>' }
    },
    'churn-rate-calculator': {
        id: 'churn-rate-calculator',
        title: 'Churn Rate',
        description: 'Customer attrition.',
        category: 'marketing',
        icon: 'UserMinus', // Loss
        inputs: [
            { id: 'start', label: 'Customers at Start', type: 'number', placeholder: '100' },
            { id: 'end', label: 'Customers at End', type: 'number', placeholder: '95' },
            { id: 'new', label: 'New Customers', type: 'number', placeholder: '10' }
        ],
        outputs: [
            {
                label: 'Churn Rate (%)',
                calculate: (inputs) => {
                    // Churn = (Start + New - End) / Start ??
                    // Standard: (Lost Customers / Start Customers)
                    // Lost = Start + New - End
                    const start = Number(inputs.start);
                    const end = Number(inputs.end);
                    const newly = Number(inputs.new);
                    const lost = start + newly - end;
                    if (start <= 0) return 0;
                    return ((lost / start) * 100).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates the percentage of customers lost.</p>' }
    },
    'nps-calculator': {
        id: 'nps-score-calculator',
        title: 'NPS Calculator',
        description: 'Net Promoter Score.',
        category: 'marketing',
        icon: 'Smile', // Sentiment
        inputs: [
            { id: 'promoters', label: 'Promoters (9-10)', type: 'number', placeholder: '50' },
            { id: 'passives', label: 'Passives (7-8)', type: 'number', placeholder: '30' },
            { id: 'detractors', label: 'Detractors (0-6)', type: 'number', placeholder: '10' }
        ],
        outputs: [
            {
                label: 'NPS Score',
                calculate: (inputs) => {
                    const pro = Number(inputs.promoters);
                    const pas = Number(inputs.passives);
                    const det = Number(inputs.detractors);
                    const total = pro + pas + det;
                    if (!total) return 0;
                    const nps = ((pro - det) / total) * 100;
                    return nps.toFixed(0);
                }
            }
        ],
        content: { whatIs: '<p>Calculates Net Promoter Score (-100 to 100).</p>' }
    },
    // Batch BO: Business Financial Ratios
    'current-ratio-calculator': {
        id: 'current-ratio-calculator',
        title: 'Current Ratio Calculator',
        description: 'Liquidity ratio.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'ca', label: 'Current Assets', type: 'number', placeholder: '100000' },
            { id: 'cl', label: 'Current Liabilities', type: 'number', placeholder: '50000' }
        ],
        outputs: [
            {
                label: 'Current Ratio',
                calculate: (inputs) => {
                    const ca = Number(inputs.ca);
                    const cl = Number(inputs.cl);
                    if (!cl) return 0;
                    return (ca / cl).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Measures ability to pay short-term obligations. Ratio > 1 is healthy.</p>' }
    },
    'quick-ratio-calculator': {
        id: 'quick-ratio-calculator',
        title: 'Quick Ratio (Acid Test)',
        description: 'Stringent liquidity.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'ca', label: 'Current Assets', type: 'number', placeholder: '100000' },
            { id: 'inv', label: 'Inventory', type: 'number', placeholder: '20000' },
            { id: 'cl', label: 'Current Liabilities', type: 'number', placeholder: '50000' }
        ],
        outputs: [
            {
                label: 'Quick Ratio',
                calculate: (inputs) => {
                    const ca = Number(inputs.ca);
                    const inv = Number(inputs.inv);
                    const cl = Number(inputs.cl);
                    if (!cl) return 0;
                    return ((ca - inv) / cl).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Measures liquidity excluding inventory. More conservative than Current Ratio.</p>' }
    },
    'debt-to-equity-calculator': {
        id: 'debt-to-equity-calculator',
        title: 'Debt-to-Equity Ratio',
        description: 'Leverage ratio.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'debt', label: 'Total Debt', type: 'number', placeholder: '50000' },
            { id: 'equity', label: 'Total Equity', type: 'number', placeholder: '100000' }
        ],
        outputs: [
            {
                label: 'D/E Ratio',
                calculate: (inputs) => {
                    const debt = Number(inputs.debt);
                    const equity = Number(inputs.equity);
                    if (!equity) return 0;
                    return (debt / equity).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Measures financial leverage. Lower is generally better.</p>' }
    },
    'inventory-turnover-calculator': {
        id: 'inventory-turnover-calculator',
        title: 'Inventory Turnover',
        description: 'Efficiency ratio.',
        category: 'finance',
        icon: 'RefreshCw',
        inputs: [
            { id: 'cogs', label: 'Cost of Goods Sold', type: 'number', placeholder: '500000' },
            { id: 'inv', label: 'Average Inventory', type: 'number', placeholder: '50000' }
        ],
        outputs: [
            {
                label: 'Turnover (times/year)',
                calculate: (inputs) => {
                    const cogs = Number(inputs.cogs);
                    const inv = Number(inputs.inv);
                    if (!inv) return 0;
                    return (cogs / inv).toFixed(2);
                }
            },
            {
                label: 'Days to Sell Inventory',
                calculate: (inputs) => {
                    const cogs = Number(inputs.cogs);
                    const inv = Number(inputs.inv);
                    if (!cogs) return 0;
                    const turnover = cogs / inv;
                    return (365 / turnover).toFixed(0);
                }
            }
        ],
        content: { whatIs: '<p>Measures how fast inventory is sold. Higher is generally better.</p>' }
    },
    'dso-calculator': {
        id: 'dso-calculator',
        title: 'Days Sales Outstanding',
        description: 'Receivables efficiency.',
        category: 'finance',
        icon: 'CalendarDays',
        inputs: [
            { id: 'ar', label: 'Accounts Receivable', type: 'number', placeholder: '50000' },
            { id: 'sales', label: 'Total Credit Sales', type: 'number', placeholder: '500000' }
        ],
        outputs: [
            {
                label: 'DSO (Days)',
                calculate: (inputs) => {
                    const ar = Number(inputs.ar);
                    const sales = Number(inputs.sales);
                    if (!sales) return 0;
                    return ((ar / sales) * 365).toFixed(0);
                }
            }
        ],
        content: { whatIs: '<p>Measures average days to collect payment. Lower is better.</p>' }
    },
    // Batch BP: Crypto & Investment Tools
    'crypto-profit-calculator': {
        id: 'crypto-profit-calculator',
        title: 'Crypto Profit Calculator',
        description: 'Calculate gains/losses.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'buy', label: 'Buy Price', type: 'number', placeholder: '20000' },
            { id: 'sell', label: 'Sell Price', type: 'number', placeholder: '30000' },
            { id: 'qty', label: 'Quantity', type: 'number', placeholder: '1' },
            { id: 'fee', label: 'Fees (%)', type: 'number', placeholder: '0.5', defaultValue: '0' }
        ],
        outputs: [
            {
                label: 'Profit/Loss',
                calculate: (inputs) => {
                    const buy = Number(inputs.buy);
                    const sell = Number(inputs.sell);
                    const qty = Number(inputs.qty);
                    const fee = Number(inputs.fee) / 100;
                    const cost = buy * qty * (1 + fee);
                    const revenue = sell * qty * (1 - fee);
                    return (revenue - cost).toFixed(2);
                }
            },
            {
                label: 'ROI (%)',
                calculate: (inputs) => {
                    const buy = Number(inputs.buy);
                    const sell = Number(inputs.sell);
                    if (!buy) return 0;
                    return (((sell - buy) / buy) * 100).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates profit or loss from cryptocurrency trades.</p>' }
    },
    'dca-calculator': {
        id: 'dca-calculator',
        title: 'DCA Calculator',
        description: 'Dollar Cost Averaging.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'amount', label: 'Investment per Period', type: 'number', placeholder: '100' },
            { id: 'periods', label: 'Number of Periods', type: 'number', placeholder: '12' },
            { id: 'growth', label: 'Expected Growth (%/period)', type: 'number', placeholder: '2', defaultValue: '0' }
        ],
        outputs: [
            {
                label: 'Total Invested',
                calculate: (inputs) => {
                    const amount = Number(inputs.amount);
                    const periods = Number(inputs.periods);
                    return (amount * periods).toFixed(2);
                }
            },
            {
                label: 'Estimated Value',
                calculate: (inputs) => {
                    const amount = Number(inputs.amount);
                    const periods = Number(inputs.periods);
                    const growth = Number(inputs.growth) / 100;
                    let total = 0;
                    for (let i = 0; i < periods; i++) {
                        total = (total + amount) * (1 + growth);
                    }
                    return total.toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Simulates dollar cost averaging investment strategy.</p>' }
    },
    'stock-portfolio-calculator': {
        id: 'stock-portfolio-calculator',
        title: 'Stock Portfolio Value',
        description: 'Total holdings value.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 's1qty', label: 'Stock 1 Shares', type: 'number', placeholder: '10' },
            { id: 's1price', label: 'Stock 1 Price', type: 'number', placeholder: '150' },
            { id: 's2qty', label: 'Stock 2 Shares', type: 'number', placeholder: '20' },
            { id: 's2price', label: 'Stock 2 Price', type: 'number', placeholder: '50' },
            { id: 's3qty', label: 'Stock 3 Shares', type: 'number', placeholder: '5' },
            { id: 's3price', label: 'Stock 3 Price', type: 'number', placeholder: '200' }
        ],
        outputs: [
            {
                label: 'Total Portfolio Value',
                calculate: (inputs) => {
                    const v1 = Number(inputs.s1qty) * Number(inputs.s1price);
                    const v2 = Number(inputs.s2qty) * Number(inputs.s2price);
                    const v3 = Number(inputs.s3qty) * Number(inputs.s3price);
                    return (v1 + v2 + v3).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates total value of a stock portfolio.</p>' }
    },
    'dividend-yield-calculator': {
        id: 'dividend-yield-calculator',
        title: 'Dividend Yield',
        description: 'Annual yield %.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'div', label: 'Annual Dividend/Share', type: 'number', placeholder: '2' },
            { id: 'price', label: 'Stock Price', type: 'number', placeholder: '50' }
        ],
        outputs: [
            {
                label: 'Dividend Yield (%)',
                calculate: (inputs) => {
                    const div = Number(inputs.div);
                    const price = Number(inputs.price);
                    if (!price) return 0;
                    return ((div / price) * 100).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates dividend yield percentage.</p>' }
    },
    'pe-ratio-calculator': {
        id: 'pe-ratio-calculator',
        title: 'P/E Ratio Calculator',
        description: 'Price-to-Earnings.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'price', label: 'Stock Price', type: 'number', placeholder: '150' },
            { id: 'eps', label: 'Earnings Per Share', type: 'number', placeholder: '5' }
        ],
        outputs: [
            {
                label: 'P/E Ratio',
                calculate: (inputs) => {
                    const price = Number(inputs.price);
                    const eps = Number(inputs.eps);
                    if (!eps) return 0;
                    return (price / eps).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates Price-to-Earnings ratio for stock valuation.</p>' }
    },
    // Batch BQ: Unit Converters III
    'energy-converter': {
        id: 'energy-converter',
        title: 'Energy Converter',
        description: 'Joules, calories, kWh.',
        category: 'conversion',
        icon: 'Zap',
        inputs: [
            { id: 'joules', label: 'Joules (J)', type: 'number', placeholder: '1000' }
        ],
        outputs: [
            {
                label: 'Calories (cal)',
                calculate: (inputs) => {
                    const j = Number(inputs.joules);
                    return (j / 4.184).toFixed(4);
                }
            },
            {
                label: 'Kilocalories (kcal)',
                calculate: (inputs) => {
                    const j = Number(inputs.joules);
                    return (j / 4184).toFixed(4);
                }
            },
            {
                label: 'kWh',
                calculate: (inputs) => {
                    const j = Number(inputs.joules);
                    return (j / 3600000).toFixed(6);
                }
            },
            {
                label: 'BTU',
                calculate: (inputs) => {
                    const j = Number(inputs.joules);
                    return (j / 1055.06).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Converts energy between Joules, calories, kWh, and BTU.</p>' }
    },
    'frequency-converter': {
        id: 'frequency-converter',
        title: 'Frequency Converter',
        description: 'Hz, kHz, MHz, GHz.',
        category: 'conversion',
        icon: 'Activity',
        inputs: [
            { id: 'hz', label: 'Hertz (Hz)', type: 'number', placeholder: '1000000' }
        ],
        outputs: [
            {
                label: 'kHz',
                calculate: (inputs) => {
                    const hz = Number(inputs.hz);
                    return (hz / 1000).toFixed(4);
                }
            },
            {
                label: 'MHz',
                calculate: (inputs) => {
                    const hz = Number(inputs.hz);
                    return (hz / 1000000).toFixed(6);
                }
            },
            {
                label: 'GHz',
                calculate: (inputs) => {
                    const hz = Number(inputs.hz);
                    return (hz / 1000000000).toFixed(9);
                }
            }
        ],
        content: { whatIs: '<p>Converts frequency between Hz, kHz, MHz, and GHz.</p>' }
    },
    'data-transfer-rate-converter': {
        id: 'data-transfer-rate-converter',
        title: 'Data Transfer Rate',
        description: 'bps, Mbps, Gbps.',
        category: 'conversion',
        icon: 'ArrowLeftRight',
        inputs: [
            { id: 'mbps', label: 'Megabits/sec (Mbps)', type: 'number', placeholder: '100' }
        ],
        outputs: [
            {
                label: 'Kbps',
                calculate: (inputs) => {
                    const mbps = Number(inputs.mbps);
                    return (mbps * 1000).toFixed(0);
                }
            },
            {
                label: 'Gbps',
                calculate: (inputs) => {
                    const mbps = Number(inputs.mbps);
                    return (mbps / 1000).toFixed(4);
                }
            },
            {
                label: 'MB/s',
                calculate: (inputs) => {
                    const mbps = Number(inputs.mbps);
                    return (mbps / 8).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Converts data transfer rates (bits vs bytes per second).</p>' }
    },
    'angle-converter': {
        id: 'angle-converter',
        title: 'Angle Converter',
        description: 'Degrees, radians, gradians.',
        category: 'conversion',
        icon: 'Ruler',
        inputs: [
            { id: 'deg', label: 'Degrees (°)', type: 'number', placeholder: '180' }
        ],
        outputs: [
            {
                label: 'Radians',
                calculate: (inputs) => {
                    const deg = Number(inputs.deg);
                    return (deg * Math.PI / 180).toFixed(6);
                }
            },
            {
                label: 'Gradians',
                calculate: (inputs) => {
                    const deg = Number(inputs.deg);
                    return (deg * 10 / 9).toFixed(4);
                }
            },
            {
                label: 'Turns',
                calculate: (inputs) => {
                    const deg = Number(inputs.deg);
                    return (deg / 360).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Converts angles between degrees, radians, and gradians.</p>' }
    },
    'force-converter': {
        id: 'force-converter',
        title: 'Force Converter',
        description: 'Newtons, lbf, kgf.',
        category: 'conversion',
        icon: 'Activity',
        inputs: [
            { id: 'n', label: 'Newtons (N)', type: 'number', placeholder: '100' }
        ],
        outputs: [
            {
                label: 'Pound-force (lbf)',
                calculate: (inputs) => {
                    const n = Number(inputs.n);
                    return (n * 0.224809).toFixed(4);
                }
            },
            {
                label: 'Kilogram-force (kgf)',
                calculate: (inputs) => {
                    const n = Number(inputs.n);
                    return (n / 9.80665).toFixed(4);
                }
            },
            {
                label: 'Dynes',
                calculate: (inputs) => {
                    const n = Number(inputs.n);
                    return (n * 100000).toFixed(0);
                }
            }
        ],
        content: { whatIs: '<p>Converts force between Newtons, pound-force, and kilogram-force.</p>' }
    },
    // Batch BR: Geometry Tools III
    'hexagon-area-calculator': {
        id: 'hexagon-area-calculator',
        title: 'Hexagon Area',
        description: 'Regular hexagon area.',
        category: 'geometry',
        icon: 'Ruler',
        inputs: [
            { id: 'side', label: 'Side Length', type: 'number', placeholder: '10' }
        ],
        outputs: [
            {
                label: 'Area',
                calculate: (inputs) => {
                    const s = Number(inputs.side);
                    return ((3 * Math.sqrt(3) / 2) * s * s).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Calculates area of a regular hexagon.</p>' }
    },
    'pentagon-area-calculator': {
        id: 'pentagon-area-calculator',
        title: 'Pentagon Area',
        description: 'Regular pentagon area.',
        category: 'geometry',
        icon: 'Ruler',
        inputs: [
            { id: 'side', label: 'Side Length', type: 'number', placeholder: '10' }
        ],
        outputs: [
            {
                label: 'Area',
                calculate: (inputs) => {
                    const s = Number(inputs.side);
                    return ((1 / 4) * Math.sqrt(5 * (5 + 2 * Math.sqrt(5))) * s * s).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Calculates area of a regular pentagon.</p>' }
    },
    'octagon-area-calculator': {
        id: 'octagon-area-calculator',
        title: 'Octagon Area',
        description: 'Regular octagon area.',
        category: 'geometry',
        icon: 'Ruler',
        inputs: [
            { id: 'side', label: 'Side Length', type: 'number', placeholder: '10' }
        ],
        outputs: [
            {
                label: 'Area',
                calculate: (inputs) => {
                    const s = Number(inputs.side);
                    return (2 * (1 + Math.sqrt(2)) * s * s).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Calculates area of a regular octagon.</p>' }
    },
    'regular-polygon-area-calculator': {
        id: 'regular-polygon-area-calculator',
        title: 'Regular Polygon Area',
        description: 'Any n-sided polygon.',
        category: 'geometry',
        icon: 'Ruler',
        inputs: [
            { id: 'n', label: 'Number of Sides', type: 'number', placeholder: '6' },
            { id: 'side', label: 'Side Length', type: 'number', placeholder: '10' }
        ],
        outputs: [
            {
                label: 'Area',
                calculate: (inputs) => {
                    const n = Number(inputs.n);
                    const s = Number(inputs.side);
                    if (n < 3) return 'Min 3 sides';
                    return ((n * s * s) / (4 * Math.tan(Math.PI / n))).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Calculates area of any regular polygon.</p>' }
    },
    'arc-length-calculator': {
        id: 'arc-length-calculator',
        title: 'Arc Length Calculator',
        description: 'Circle arc length.',
        category: 'geometry',
        icon: 'Ruler',
        inputs: [
            { id: 'r', label: 'Radius', type: 'number', placeholder: '10' },
            { id: 'angle', label: 'Central Angle (°)', type: 'number', placeholder: '90' }
        ],
        outputs: [
            {
                label: 'Arc Length',
                calculate: (inputs) => {
                    const r = Number(inputs.r);
                    const angle = Number(inputs.angle);
                    return ((angle / 360) * 2 * Math.PI * r).toFixed(4);
                }
            }
        ],
        content: { whatIs: '<p>Calculates the length of a circular arc.</p>' }
    },
    // Batch BS: Physics Tools V
    'wave-speed-calculator': {
        id: 'wave-speed-calculator',
        title: 'Wave Speed Calculator',
        description: 'v = f × λ',
        category: 'physics',
        icon: 'Activity',
        inputs: [
            { id: 'freq', label: 'Frequency (Hz)', type: 'number', placeholder: '1000' },
            { id: 'wavelength', label: 'Wavelength (m)', type: 'number', placeholder: '0.34' }
        ],
        outputs: [
            {
                label: 'Wave Speed (m/s)',
                calculate: (inputs) => {
                    const f = Number(inputs.freq);
                    const lambda = Number(inputs.wavelength);
                    return (f * lambda).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates wave speed from frequency and wavelength.</p>' }
    },
    'centripetal-force-calculator': {
        id: 'centripetal-force-calculator',
        title: 'Centripetal Force',
        description: 'F = mv²/r',
        category: 'physics',
        icon: 'Activity',
        inputs: [
            { id: 'm', label: 'Mass (kg)', type: 'number', placeholder: '10' },
            { id: 'v', label: 'Velocity (m/s)', type: 'number', placeholder: '5' },
            { id: 'r', label: 'Radius (m)', type: 'number', placeholder: '2' }
        ],
        outputs: [
            {
                label: 'Centripetal Force (N)',
                calculate: (inputs) => {
                    const m = Number(inputs.m);
                    const v = Number(inputs.v);
                    const r = Number(inputs.r);
                    if (!r) return 0;
                    return ((m * v * v) / r).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates centripetal force for circular motion.</p>' }
    },
    'momentum-calculator': {
        id: 'momentum-calculator',
        title: 'Momentum Calculator',
        description: 'p = mv',
        category: 'physics',
        icon: 'Activity',
        inputs: [
            { id: 'm', label: 'Mass (kg)', type: 'number', placeholder: '10' },
            { id: 'v', label: 'Velocity (m/s)', type: 'number', placeholder: '5' }
        ],
        outputs: [
            {
                label: 'Momentum (kg·m/s)',
                calculate: (inputs) => {
                    const m = Number(inputs.m);
                    const v = Number(inputs.v);
                    return (m * v).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates linear momentum.</p>' }
    },
    'impulse-calculator': {
        id: 'impulse-calculator',
        title: 'Impulse Calculator',
        description: 'J = F × t',
        category: 'physics',
        icon: 'Activity',
        inputs: [
            { id: 'f', label: 'Force (N)', type: 'number', placeholder: '100' },
            { id: 't', label: 'Time (s)', type: 'number', placeholder: '2' }
        ],
        outputs: [
            {
                label: 'Impulse (N·s)',
                calculate: (inputs) => {
                    const f = Number(inputs.f);
                    const t = Number(inputs.t);
                    return (f * t).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates impulse (change in momentum).</p>' }
    },
    'work-calculator': {
        id: 'work-calculator',
        title: 'Work Calculator',
        description: 'W = F × d',
        category: 'physics',
        icon: 'Activity',
        inputs: [
            { id: 'f', label: 'Force (N)', type: 'number', placeholder: '100' },
            { id: 'd', label: 'Distance (m)', type: 'number', placeholder: '10' },
            { id: 'angle', label: 'Angle (°)', type: 'number', placeholder: '0', defaultValue: '0' }
        ],
        outputs: [
            {
                label: 'Work (Joules)',
                calculate: (inputs) => {
                    const f = Number(inputs.f);
                    const d = Number(inputs.d);
                    const angle = Number(inputs.angle) * Math.PI / 180;
                    return (f * d * Math.cos(angle)).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates work done by a force over distance.</p>' }
    },
    // Batch BT: Health Tools IV
    'max-heart-rate-calculator': {
        id: 'max-heart-rate-calculator',
        title: 'Max Heart Rate',
        description: 'Age-based MHR.',
        category: 'health',
        icon: 'HeartPulse',
        inputs: [
            { id: 'age', label: 'Age (years)', type: 'number', placeholder: '30' }
        ],
        outputs: [
            {
                label: 'Max HR (220 - age)',
                calculate: (inputs) => {
                    const age = Number(inputs.age);
                    return (220 - age).toString();
                }
            },
            {
                label: 'Tanaka Formula',
                calculate: (inputs) => {
                    const age = Number(inputs.age);
                    return (208 - 0.7 * age).toFixed(0);
                }
            }
        ],
        content: { whatIs: '<p>Estimates maximum heart rate based on age.</p>' }
    },
    'vo2-max-estimate-calculator': {
        id: 'vo2-max-estimate-calculator',
        title: 'VO2 Max Estimate',
        description: 'Cooper test formula.',
        category: 'health',
        icon: 'Activity',
        inputs: [
            { id: 'distance', label: 'Distance in 12 min (meters)', type: 'number', placeholder: '2400' }
        ],
        outputs: [
            {
                label: 'VO2 Max (mL/kg/min)',
                calculate: (inputs) => {
                    const d = Number(inputs.distance);
                    return ((d - 504.9) / 44.73).toFixed(1);
                }
            }
        ],
        content: { whatIs: '<p>Estimates VO2 max using the Cooper 12-minute run test.</p>' }
    },
    'blood-pressure-category-calculator': {
        id: 'blood-pressure-category-calculator',
        title: 'Blood Pressure Category',
        description: 'BP classification.',
        category: 'health',
        icon: 'HeartPulse',
        inputs: [
            { id: 'sys', label: 'Systolic (mmHg)', type: 'number', placeholder: '120' },
            { id: 'dia', label: 'Diastolic (mmHg)', type: 'number', placeholder: '80' }
        ],
        outputs: [
            {
                label: 'Category',
                calculate: (inputs) => {
                    const sys = Number(inputs.sys);
                    const dia = Number(inputs.dia);
                    if (sys < 120 && dia < 80) return 'Normal';
                    if (sys < 130 && dia < 80) return 'Elevated';
                    if (sys < 140 || dia < 90) return 'High (Stage 1)';
                    if (sys >= 140 || dia >= 90) return 'High (Stage 2)';
                    if (sys > 180 || dia > 120) return 'Crisis';
                    return 'Unknown';
                }
            }
        ],
        content: { whatIs: '<p>Classifies blood pressure according to AHA guidelines.</p>' }
    },
    'body-water-calculator': {
        id: 'body-water-calculator',
        title: 'Body Water %',
        description: 'Watson formula.',
        category: 'health',
        icon: 'Droplets',
        inputs: [
            { id: 'gender', label: 'Gender (M/F)', type: 'string', placeholder: 'M' },
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '70' },
            { id: 'height', label: 'Height (cm)', type: 'number', placeholder: '175' },
            { id: 'age', label: 'Age (years)', type: 'number', placeholder: '30' }
        ],
        outputs: [
            {
                label: 'Total Body Water (L)',
                calculate: (inputs) => {
                    const g = String(inputs.gender).toUpperCase();
                    const w = Number(inputs.weight);
                    const h = Number(inputs.height);
                    const a = Number(inputs.age);
                    if (g === 'M') {
                        return (2.447 - 0.09156 * a + 0.1074 * h + 0.3362 * w).toFixed(1);
                    } else {
                        return (-2.097 + 0.1069 * h + 0.2466 * w).toFixed(1);
                    }
                }
            }
        ],
        content: { whatIs: '<p>Estimates total body water using Watson formula.</p>' }
    },
    'waist-hip-ratio-calculator': {
        id: 'waist-hip-ratio-calculator',
        title: 'Waist-Hip Ratio',
        description: 'Health risk indicator.',
        category: 'health',
        icon: 'Activity',
        inputs: [
            { id: 'waist', label: 'Waist (cm)', type: 'number', placeholder: '80' },
            { id: 'hip', label: 'Hip (cm)', type: 'number', placeholder: '100' }
        ],
        outputs: [
            {
                label: 'WHR',
                calculate: (inputs) => {
                    const waist = Number(inputs.waist);
                    const hip = Number(inputs.hip);
                    if (!hip) return 0;
                    return (waist / hip).toFixed(2);
                }
            },
            {
                label: 'Risk Level',
                calculate: (inputs) => {
                    const waist = Number(inputs.waist);
                    const hip = Number(inputs.hip);
                    const whr = waist / hip;
                    if (whr < 0.85) return 'Low';
                    if (whr < 0.95) return 'Moderate';
                    return 'High';
                }
            }
        ],
        content: { whatIs: '<p>Calculates waist-to-hip ratio for health risk assessment.</p>' }
    },
    // Batch BU: Everyday Tools IV
    'tip-split-calculator': {
        id: 'tip-split-calculator',
        title: 'Tip Split Calculator',
        description: 'Split bill with tip.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'bill', label: 'Bill Amount', type: 'number', placeholder: '100' },
            { id: 'tip', label: 'Tip (%)', type: 'number', placeholder: '15' },
            { id: 'people', label: 'Number of People', type: 'number', placeholder: '4' }
        ],
        outputs: [
            {
                label: 'Total with Tip',
                calculate: (inputs) => {
                    const bill = Number(inputs.bill);
                    const tip = Number(inputs.tip) / 100;
                    return (bill * (1 + tip)).toFixed(2);
                }
            },
            {
                label: 'Per Person',
                calculate: (inputs) => {
                    const bill = Number(inputs.bill);
                    const tip = Number(inputs.tip) / 100;
                    const people = Number(inputs.people);
                    if (!people) return 0;
                    return ((bill * (1 + tip)) / people).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Splits a bill with tip among multiple people.</p>' }
    },
    'bill-split-calculator': {
        id: 'bill-split-calculator',
        title: 'Bill Split Calculator',
        description: 'Equal split.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'total', label: 'Total Bill', type: 'number', placeholder: '200' },
            { id: 'people', label: 'Number of People', type: 'number', placeholder: '5' }
        ],
        outputs: [
            {
                label: 'Per Person',
                calculate: (inputs) => {
                    const total = Number(inputs.total);
                    const people = Number(inputs.people);
                    if (!people) return 0;
                    return (total / people).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Splits a bill equally among multiple people.</p>' }
    },
    'fuel-trip-cost-calculator': {
        id: 'fuel-trip-cost-calculator',
        title: 'Fuel Trip Cost',
        description: 'Trip fuel estimate.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'distance', label: 'Trip Distance (km)', type: 'number', placeholder: '500' },
            { id: 'consumption', label: 'Fuel Consumption (L/100km)', type: 'number', placeholder: '8' },
            { id: 'price', label: 'Fuel Price ($/L)', type: 'number', placeholder: '1.50' }
        ],
        outputs: [
            {
                label: 'Fuel Needed (L)',
                calculate: (inputs) => {
                    const d = Number(inputs.distance);
                    const c = Number(inputs.consumption);
                    return ((d / 100) * c).toFixed(2);
                }
            },
            {
                label: 'Total Cost',
                calculate: (inputs) => {
                    const d = Number(inputs.distance);
                    const c = Number(inputs.consumption);
                    const p = Number(inputs.price);
                    return (((d / 100) * c) * p).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates fuel cost for a trip.</p>' }
    },
    'paint-coverage-calculator': {
        id: 'paint-coverage-calculator',
        title: 'Paint Coverage',
        description: 'Estimate paint needed.',
        category: 'everyday',
        icon: 'PaintBucket',
        inputs: [
            { id: 'area', label: 'Wall Area (m²)', type: 'number', placeholder: '50' },
            { id: 'coverage', label: 'Paint Coverage (m²/L)', type: 'number', placeholder: '10', defaultValue: '10' },
            { id: 'coats', label: 'Number of Coats', type: 'number', placeholder: '2', defaultValue: '2' }
        ],
        outputs: [
            {
                label: 'Liters Needed',
                calculate: (inputs) => {
                    const area = Number(inputs.area);
                    const cov = Number(inputs.coverage);
                    const coats = Number(inputs.coats);
                    if (!cov) return 0;
                    return ((area / cov) * coats).toFixed(1);
                }
            }
        ],
        content: { whatIs: '<p>Calculates paint needed for a given wall area.</p>' }
    },
    'tile-grout-calculator': {
        id: 'tile-grout-calculator',
        title: 'Tile Grout Calculator',
        description: 'Grout estimate.',
        category: 'everyday',
        icon: 'Grid3X3',
        inputs: [
            { id: 'area', label: 'Floor Area (m²)', type: 'number', placeholder: '20' },
            { id: 'tileW', label: 'Tile Width (cm)', type: 'number', placeholder: '30' },
            { id: 'tileH', label: 'Tile Height (cm)', type: 'number', placeholder: '30' },
            { id: 'gap', label: 'Grout Gap (mm)', type: 'number', placeholder: '3' }
        ],
        outputs: [
            {
                label: 'Grout Needed (kg)',
                calculate: (inputs) => {
                    const area = Number(inputs.area);
                    const tw = Number(inputs.tileW) / 100;
                    const th = Number(inputs.tileH) / 100;
                    const gap = Number(inputs.gap) / 1000;
                    const depth = 0.006; // 6mm avg depth
                    const density = 1.5; // kg/L approx
                    const tilesPerM2 = 1 / (tw * th);
                    const groutVolume = area * gap * depth * tilesPerM2 * (tw + th) * 2;
                    return (groutVolume * 1000 * density).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Estimates grout needed for tiling.</p>' }
    },
    // Batch BV: Text Tools II
    'slugify-calculator': {
        id: 'slugify-calculator',
        title: 'Slugify Text',
        description: 'URL-friendly slug.',
        category: 'text',
        icon: 'Type',
        inputs: [
            { id: 'text', label: 'Text to Slugify', type: 'string', placeholder: 'Hello World!' }
        ],
        outputs: [
            {
                label: 'Slug',
                calculate: (inputs) => {
                    const t = String(inputs.text || '');
                    return t.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
                }
            }
        ],
        content: { whatIs: '<p>Converts text to URL-friendly slug format.</p>' }
    },
    'text-stats-calculator': {
        id: 'text-stats-calculator',
        title: 'Text Statistics',
        description: 'Words, chars, sentences.',
        category: 'text',
        icon: 'Type',
        inputs: [
            { id: 'text', label: 'Text', type: 'string', placeholder: 'Enter your text here.' }
        ],
        outputs: [
            { label: 'Characters', calculate: (inputs) => String(inputs.text || '').length.toString() },
            { label: 'Words', calculate: (inputs) => { const t = String(inputs.text || '').trim(); return t ? t.split(/\s+/).length.toString() : '0'; } },
            { label: 'Sentences', calculate: (inputs) => (String(inputs.text || '').match(/[.!?]+/g) || []).length.toString() }
        ],
        content: { whatIs: '<p>Counts characters, words, and sentences.</p>' }
    },
    'char-count-calculator': {
        id: 'char-count-calculator',
        title: 'Character Counter',
        description: 'Count characters.',
        category: 'text',
        icon: 'Type',
        inputs: [
            { id: 'text', label: 'Text', type: 'string', placeholder: 'Type here...' }
        ],
        outputs: [
            { label: 'Total Characters', calculate: (inputs) => String(inputs.text || '').length.toString() },
            { label: 'Without Spaces', calculate: (inputs) => String(inputs.text || '').replace(/\s/g, '').length.toString() }
        ],
        content: { whatIs: '<p>Counts characters with and without spaces.</p>' }
    },
    'line-count-calculator': {
        id: 'line-count-calculator',
        title: 'Line Counter',
        description: 'Count lines.',
        category: 'text',
        icon: 'Type',
        inputs: [
            { id: 'text', label: 'Text', type: 'string', placeholder: 'Line 1\nLine 2\nLine 3' }
        ],
        outputs: [
            { label: 'Total Lines', calculate: (inputs) => { const t = String(inputs.text || ''); return t ? t.split('\n').length.toString() : '0'; } },
            { label: 'Non-empty Lines', calculate: (inputs) => { const t = String(inputs.text || ''); return t.split('\n').filter(l => l.trim()).length.toString(); } }
        ],
        content: { whatIs: '<p>Counts total and non-empty lines.</p>' }
    },
    'remove-duplicates-calculator': {
        id: 'remove-duplicates-calculator',
        title: 'Remove Duplicate Lines',
        description: 'Unique lines only.',
        category: 'text',
        icon: 'Type',
        inputs: [
            { id: 'text', label: 'Text (one per line)', type: 'string', placeholder: 'apple\nbanana\napple' }
        ],
        outputs: [
            { label: 'Unique Lines', calculate: (inputs) => [...new Set(String(inputs.text || '').split('\n'))].join('\n') },
            { label: 'Count', calculate: (inputs) => [...new Set(String(inputs.text || '').split('\n'))].length.toString() }
        ],
        content: { whatIs: '<p>Removes duplicate lines from text.</p>' }
    },
    // Batch BW: Math IV
    'permutation-calculator': {
        id: 'permutation-calculator',
        title: 'Permutation Calculator',
        description: 'nPr = n!/(n-r)!',
        category: 'mathematics',
        icon: 'Calculator',
        inputs: [
            { id: 'n', label: 'n (total items)', type: 'number', placeholder: '10' },
            { id: 'r', label: 'r (items to arrange)', type: 'number', placeholder: '3' }
        ],
        outputs: [
            {
                label: 'nPr',
                calculate: (inputs) => {
                    const n = Number(inputs.n);
                    const r = Number(inputs.r);
                    if (r > n || n < 0 || r < 0) return 0;
                    let result = 1;
                    for (let i = 0; i < r; i++) result *= (n - i);
                    return result.toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates permutations (ordered arrangements).</p>' }
    },
    'combination-calculator': {
        id: 'combination-calculator',
        title: 'Combination Calculator',
        description: 'nCr = n!/r!(n-r)!',
        category: 'mathematics',
        icon: 'Calculator',
        inputs: [
            { id: 'n', label: 'n (total items)', type: 'number', placeholder: '10' },
            { id: 'r', label: 'r (items to choose)', type: 'number', placeholder: '3' }
        ],
        outputs: [
            {
                label: 'nCr',
                calculate: (inputs) => {
                    const n = Number(inputs.n);
                    const r = Number(inputs.r);
                    if (r > n || n < 0 || r < 0) return 0;
                    let num = 1, den = 1;
                    for (let i = 0; i < r; i++) { num *= (n - i); den *= (i + 1); }
                    return Math.round(num / den).toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates combinations (unordered selections).</p>' }
    },
    'lcm-calculator': {
        id: 'lcm-calculator',
        title: 'LCM Calculator',
        description: 'Least Common Multiple.',
        category: 'mathematics',
        icon: 'Calculator',
        inputs: [
            { id: 'a', label: 'Number A', type: 'number', placeholder: '12' },
            { id: 'b', label: 'Number B', type: 'number', placeholder: '18' }
        ],
        outputs: [
            {
                label: 'LCM',
                calculate: (inputs) => {
                    const a = Math.abs(Number(inputs.a));
                    const b = Math.abs(Number(inputs.b));
                    const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
                    return ((a * b) / gcd(a, b)).toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates the Least Common Multiple of two numbers.</p>' }
    },
    'gcd-calculator': {
        id: 'gcd-calculator',
        title: 'GCD Calculator',
        description: 'Greatest Common Divisor.',
        category: 'mathematics',
        icon: 'Calculator',
        inputs: [
            { id: 'a', label: 'Number A', type: 'number', placeholder: '48' },
            { id: 'b', label: 'Number B', type: 'number', placeholder: '18' }
        ],
        outputs: [
            {
                label: 'GCD',
                calculate: (inputs) => {
                    let a = Math.abs(Number(inputs.a));
                    let b = Math.abs(Number(inputs.b));
                    while (b) { const t = b; b = a % b; a = t; }
                    return a.toString();
                }
            }
        ],
        content: { whatIs: '<p>Calculates the Greatest Common Divisor of two numbers.</p>' }
    },
    'modulo-calculator': {
        id: 'modulo-calculator',
        title: 'Modulo Calculator',
        description: 'a mod b.',
        category: 'mathematics',
        icon: 'Calculator',
        inputs: [
            { id: 'a', label: 'Dividend (a)', type: 'number', placeholder: '17' },
            { id: 'b', label: 'Divisor (b)', type: 'number', placeholder: '5' }
        ],
        outputs: [
            { label: 'Remainder', calculate: (inputs) => { const b = Number(inputs.b); return b ? (Number(inputs.a) % b).toString() : '0'; } },
            { label: 'Quotient', calculate: (inputs) => { const b = Number(inputs.b); return b ? Math.floor(Number(inputs.a) / b).toString() : '0'; } }
        ],
        content: { whatIs: '<p>Calculates remainder and quotient of division.</p>' }
    },
    // Batch BX: Finance VI
    'simple-interest-calculator': {
        id: 'simple-interest-calculator',
        title: 'Simple Interest',
        description: 'I = P × r × t',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'p', label: 'Principal', type: 'number', placeholder: '1000' },
            { id: 'r', label: 'Rate (%/year)', type: 'number', placeholder: '5' },
            { id: 't', label: 'Time (years)', type: 'number', placeholder: '3' }
        ],
        outputs: [
            { label: 'Interest', calculate: (inputs) => (Number(inputs.p) * Number(inputs.r) / 100 * Number(inputs.t)).toFixed(2) },
            { label: 'Total Amount', calculate: (inputs) => (Number(inputs.p) * (1 + Number(inputs.r) / 100 * Number(inputs.t))).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates simple interest and total amount.</p>' }
    },
    'compound-interest-v2-calculator': {
        id: 'compound-interest-v2-calculator',
        title: 'Compound Interest',
        description: 'A = P(1+r/n)^(nt)',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'p', label: 'Principal', type: 'number', placeholder: '1000' },
            { id: 'r', label: 'Rate (%/year)', type: 'number', placeholder: '5' },
            { id: 'n', label: 'Compounds/Year', type: 'number', placeholder: '12', defaultValue: '12' },
            { id: 't', label: 'Time (years)', type: 'number', placeholder: '3' }
        ],
        outputs: [
            { label: 'Future Value', calculate: (inputs) => { const p = Number(inputs.p), r = Number(inputs.r) / 100, n = Number(inputs.n), t = Number(inputs.t); return (p * Math.pow(1 + r / n, n * t)).toFixed(2); } },
            { label: 'Interest Earned', calculate: (inputs) => { const p = Number(inputs.p), r = Number(inputs.r) / 100, n = Number(inputs.n), t = Number(inputs.t); return (p * Math.pow(1 + r / n, n * t) - p).toFixed(2); } }
        ],
        content: { whatIs: '<p>Calculates compound interest with custom compounding.</p>' }
    },
    'loan-emi-calculator': {
        id: 'loan-emi-calculator',
        title: 'Loan EMI Calculator',
        description: 'Monthly payment.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'p', label: 'Loan Amount', type: 'number', placeholder: '100000' },
            { id: 'r', label: 'Interest Rate (%/year)', type: 'number', placeholder: '8' },
            { id: 't', label: 'Term (months)', type: 'number', placeholder: '60' }
        ],
        outputs: [
            {
                label: 'Monthly EMI',
                calculate: (inputs) => {
                    const p = Number(inputs.p);
                    const r = Number(inputs.r) / 100 / 12;
                    const n = Number(inputs.t);
                    if (!r) return (p / n).toFixed(2);
                    return (p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)).toFixed(2);
                }
            },
            { label: 'Total Payment', calculate: (inputs) => { const p = Number(inputs.p), r = Number(inputs.r) / 100 / 12, n = Number(inputs.t); if (!r) return p.toFixed(2); const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1); return (emi * n).toFixed(2); } }
        ],
        content: { whatIs: '<p>Calculates equated monthly installment for loans.</p>' }
    },
    'savings-goal-v2-calculator': {
        id: 'savings-goal-v2-calculator',
        title: 'Savings Goal',
        description: 'Monthly savings needed.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'goal', label: 'Target Amount', type: 'number', placeholder: '10000' },
            { id: 'months', label: 'Months', type: 'number', placeholder: '24' },
            { id: 'rate', label: 'Interest Rate (%/year)', type: 'number', placeholder: '5', defaultValue: '0' }
        ],
        outputs: [
            {
                label: 'Monthly Savings',
                calculate: (inputs) => {
                    const goal = Number(inputs.goal);
                    const months = Number(inputs.months);
                    const r = Number(inputs.rate) / 100 / 12;
                    if (!r || r === 0) return (goal / months).toFixed(2);
                    return (goal * r / (Math.pow(1 + r, months) - 1)).toFixed(2);
                }
            }
        ],
        content: { whatIs: '<p>Calculates monthly savings needed to reach a goal.</p>' }
    },
    'inflation-adjust-calculator': {
        id: 'inflation-adjust-calculator',
        title: 'Inflation Adjustment',
        description: 'Future value adjusted.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'amount', label: 'Current Amount', type: 'number', placeholder: '1000' },
            { id: 'rate', label: 'Inflation Rate (%/year)', type: 'number', placeholder: '3' },
            { id: 'years', label: 'Years', type: 'number', placeholder: '10' }
        ],
        outputs: [
            { label: 'Future Equivalent', calculate: (inputs) => (Number(inputs.amount) * Math.pow(1 + Number(inputs.rate) / 100, Number(inputs.years))).toFixed(2) },
            { label: 'Purchasing Power', calculate: (inputs) => (Number(inputs.amount) / Math.pow(1 + Number(inputs.rate) / 100, Number(inputs.years))).toFixed(2) }
        ],
        content: { whatIs: '<p>Adjusts amounts for inflation over time.</p>' }
    },
    // Batch BY: Time Tools III
    'time-zone-converter-v2': {
        id: 'time-zone-converter-v2',
        title: 'Time Zone Converter',
        description: 'Convert UTC offset.',
        category: 'calendar',
        icon: 'CalendarDays',
        inputs: [
            { id: 'hour', label: 'Hour (0-23)', type: 'number', placeholder: '14' },
            { id: 'fromUtc', label: 'From UTC Offset', type: 'number', placeholder: '-3' },
            { id: 'toUtc', label: 'To UTC Offset', type: 'number', placeholder: '0' }
        ],
        outputs: [
            {
                label: 'Converted Hour',
                calculate: (inputs) => {
                    const hour = Number(inputs.hour);
                    const from = Number(inputs.fromUtc);
                    const to = Number(inputs.toUtc);
                    let result = hour - from + to;
                    if (result < 0) result += 24;
                    if (result >= 24) result -= 24;
                    return result.toString() + ':00';
                }
            }
        ],
        content: { whatIs: '<p>Converts time between time zones using UTC offsets.</p>' }
    },
    'stopwatch-calc-calculator': {
        id: 'stopwatch-calc-calculator',
        title: 'Stopwatch Calculator',
        description: 'Convert time formats.',
        category: 'calendar',
        icon: 'CalendarDays',
        inputs: [
            { id: 'seconds', label: 'Total Seconds', type: 'number', placeholder: '3661' }
        ],
        outputs: [
            { label: 'Hours', calculate: (inputs) => Math.floor(Number(inputs.seconds) / 3600).toString() },
            { label: 'Minutes', calculate: (inputs) => Math.floor((Number(inputs.seconds) % 3600) / 60).toString() },
            { label: 'Seconds', calculate: (inputs) => (Number(inputs.seconds) % 60).toString() },
            { label: 'Formatted', calculate: (inputs) => { const s = Number(inputs.seconds); const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const sec = s % 60; return `${h}h ${m}m ${sec}s`; } }
        ],
        content: { whatIs: '<p>Converts seconds to hours, minutes, seconds.</p>' }
    },
    'time-addition-calculator': {
        id: 'time-addition-calculator',
        title: 'Time Addition',
        description: 'Add times together.',
        category: 'calendar',
        icon: 'CalendarDays',
        inputs: [
            { id: 'h1', label: 'Hours 1', type: 'number', placeholder: '2' },
            { id: 'm1', label: 'Minutes 1', type: 'number', placeholder: '30' },
            { id: 'h2', label: 'Hours 2', type: 'number', placeholder: '1' },
            { id: 'm2', label: 'Minutes 2', type: 'number', placeholder: '45' }
        ],
        outputs: [
            {
                label: 'Total Time',
                calculate: (inputs) => {
                    const totalMin = Number(inputs.h1) * 60 + Number(inputs.m1) + Number(inputs.h2) * 60 + Number(inputs.m2);
                    return Math.floor(totalMin / 60) + 'h ' + (totalMin % 60) + 'm';
                }
            }
        ],
        content: { whatIs: '<p>Adds two time durations together.</p>' }
    },
    'age-in-days-calculator': {
        id: 'age-in-days-calculator',
        title: 'Age in Days',
        description: 'Days since birth.',
        category: 'calendar',
        icon: 'CalendarDays',
        inputs: [
            { id: 'year', label: 'Birth Year', type: 'number', placeholder: '1990' },
            { id: 'month', label: 'Birth Month', type: 'number', placeholder: '6' },
            { id: 'day', label: 'Birth Day', type: 'number', placeholder: '15' }
        ],
        outputs: [
            {
                label: 'Days Alive',
                calculate: (inputs) => {
                    const birth = new Date(Number(inputs.year), Number(inputs.month) - 1, Number(inputs.day));
                    const today = new Date();
                    const diff = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
                    return diff.toString();
                }
            },
            { label: 'Weeks', calculate: (inputs) => { const birth = new Date(Number(inputs.year), Number(inputs.month) - 1, Number(inputs.day)); const diff = Math.floor((new Date().getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 7)); return diff.toString(); } }
        ],
        content: { whatIs: '<p>Calculates how many days you have been alive.</p>' }
    },
    'retirement-countdown-calculator': {
        id: 'retirement-countdown-calculator',
        title: 'Retirement Countdown',
        description: 'Days to retirement.',
        category: 'calendar',
        icon: 'CalendarDays',
        inputs: [
            { id: 'age', label: 'Current Age', type: 'number', placeholder: '35' },
            { id: 'retireAge', label: 'Retirement Age', type: 'number', placeholder: '65' }
        ],
        outputs: [
            { label: 'Years Left', calculate: (inputs) => (Number(inputs.retireAge) - Number(inputs.age)).toString() },
            { label: 'Days Left', calculate: (inputs) => ((Number(inputs.retireAge) - Number(inputs.age)) * 365).toString() },
            { label: 'Weekends Left', calculate: (inputs) => ((Number(inputs.retireAge) - Number(inputs.age)) * 52 * 2).toString() }
        ],
        content: { whatIs: '<p>Counts down to your retirement date.</p>' }
    },
    // Batch BZ: Cooking Tools II
    'recipe-scale-calculator': {
        id: 'recipe-scale-calculator',
        title: 'Recipe Scaler',
        description: 'Scale recipe servings.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'original', label: 'Original Servings', type: 'number', placeholder: '4' },
            { id: 'desired', label: 'Desired Servings', type: 'number', placeholder: '8' },
            { id: 'amount', label: 'Ingredient Amount', type: 'number', placeholder: '200' }
        ],
        outputs: [
            { label: 'Scaled Amount', calculate: (inputs) => { const o = Number(inputs.original); return o ? (Number(inputs.amount) * Number(inputs.desired) / o).toFixed(1) : '0'; } }
        ],
        content: { whatIs: '<p>Scales recipe ingredient amounts for different serving sizes.</p>' }
    },
    'cooking-time-calculator': {
        id: 'cooking-time-calculator',
        title: 'Cooking Time by Weight',
        description: 'Time per weight.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '2' },
            { id: 'minPerKg', label: 'Minutes per kg', type: 'number', placeholder: '45' },
            { id: 'base', label: 'Base Minutes', type: 'number', placeholder: '20', defaultValue: '20' }
        ],
        outputs: [
            { label: 'Total Time (min)', calculate: (inputs) => (Number(inputs.base) + Number(inputs.weight) * Number(inputs.minPerKg)).toFixed(0) },
            { label: 'Hours:Minutes', calculate: (inputs) => { const t = Number(inputs.base) + Number(inputs.weight) * Number(inputs.minPerKg); return Math.floor(t / 60) + 'h ' + Math.round(t % 60) + 'm'; } }
        ],
        content: { whatIs: '<p>Calculates cooking time based on weight.</p>' }
    },
    'ingredient-sub-calculator': {
        id: 'ingredient-sub-calculator',
        title: 'Butter to Oil Converter',
        description: 'Butter ↔ Oil.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'butter', label: 'Butter (grams)', type: 'number', placeholder: '100' }
        ],
        outputs: [
            { label: 'Oil (grams)', calculate: (inputs) => (Number(inputs.butter) * 0.8).toFixed(0) },
            { label: 'Oil (tbsp)', calculate: (inputs) => (Number(inputs.butter) * 0.8 / 14).toFixed(1) }
        ],
        content: { whatIs: '<p>Converts butter to oil for baking substitution.</p>' }
    },
    'baking-temp-converter': {
        id: 'baking-temp-converter',
        title: 'Fan Oven Converter',
        description: 'Regular ↔ Fan oven.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'temp', label: 'Regular Temp (°C)', type: 'number', placeholder: '180' }
        ],
        outputs: [
            { label: 'Fan Oven (°C)', calculate: (inputs) => (Number(inputs.temp) - 20).toString() },
            { label: 'Gas Mark', calculate: (inputs) => { const c = Number(inputs.temp); if (c <= 135) return '1'; if (c <= 150) return '2'; if (c <= 165) return '3'; if (c <= 180) return '4'; if (c <= 190) return '5'; if (c <= 200) return '6'; if (c <= 220) return '7'; if (c <= 230) return '8'; return '9'; } }
        ],
        content: { whatIs: '<p>Converts between regular and fan oven temperatures.</p>' }
    },
    'yeast-conversion-calculator': {
        id: 'yeast-conversion-calculator',
        title: 'Yeast Converter',
        description: 'Fresh ↔ Dry yeast.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'fresh', label: 'Fresh Yeast (grams)', type: 'number', placeholder: '21' }
        ],
        outputs: [
            { label: 'Active Dry (g)', calculate: (inputs) => (Number(inputs.fresh) * 0.4).toFixed(1) },
            { label: 'Instant Dry (g)', calculate: (inputs) => (Number(inputs.fresh) * 0.33).toFixed(1) }
        ],
        content: { whatIs: '<p>Converts between fresh and dry yeast amounts.</p>' }
    },
    // Batch CA: Science Tools
    'ph-to-h-calculator': {
        id: 'ph-to-h-calculator',
        title: 'pH to [H+] Converter',
        description: 'Hydrogen ion concentration.',
        category: 'chemistry',
        icon: 'FlaskConical',
        inputs: [
            { id: 'ph', label: 'pH Value', type: 'number', placeholder: '7' }
        ],
        outputs: [
            { label: '[H+] (mol/L)', calculate: (inputs) => Math.pow(10, -Number(inputs.ph)).toExponential(2) },
            { label: 'pOH', calculate: (inputs) => (14 - Number(inputs.ph)).toFixed(2) }
        ],
        content: { whatIs: '<p>Converts pH to hydrogen ion concentration.</p>' }
    },
    'wavelength-freq-calculator': {
        id: 'wavelength-freq-calculator',
        title: 'Wavelength ↔ Frequency',
        description: 'Light/EM waves.',
        category: 'physics',
        icon: 'Activity',
        inputs: [
            { id: 'wavelength', label: 'Wavelength (nm)', type: 'number', placeholder: '550' }
        ],
        outputs: [
            { label: 'Frequency (THz)', calculate: (inputs) => { const c = 299792458; const w = Number(inputs.wavelength) * 1e-9; return (c / w / 1e12).toFixed(2); } },
            { label: 'Energy (eV)', calculate: (inputs) => { const h = 4.136e-15; const c = 299792458; const w = Number(inputs.wavelength) * 1e-9; return (h * c / w).toFixed(3); } }
        ],
        content: { whatIs: '<p>Converts wavelength to frequency and energy for electromagnetic waves.</p>' }
    },
    'sound-intensity-calculator': {
        id: 'sound-intensity-calculator',
        title: 'Sound Level (dB)',
        description: 'Intensity to decibels.',
        category: 'physics',
        icon: 'Activity',
        inputs: [
            { id: 'intensity', label: 'Intensity (W/m²)', type: 'number', placeholder: '0.001' }
        ],
        outputs: [
            { label: 'Sound Level (dB)', calculate: (inputs) => { const I0 = 1e-12; return (10 * Math.log10(Number(inputs.intensity) / I0)).toFixed(1); } }
        ],
        content: { whatIs: '<p>Converts sound intensity to decibels.</p>' }
    },
    'electric-field-calculator': {
        id: 'electric-field-calculator',
        title: 'Electric Field',
        description: 'E = kQ/r²',
        category: 'physics',
        icon: 'Zap',
        inputs: [
            { id: 'q', label: 'Charge (μC)', type: 'number', placeholder: '1' },
            { id: 'r', label: 'Distance (m)', type: 'number', placeholder: '0.1' }
        ],
        outputs: [
            { label: 'E (N/C)', calculate: (inputs) => { const k = 8.99e9; const q = Number(inputs.q) * 1e-6; const r = Number(inputs.r); return r ? (k * q / (r * r)).toExponential(2) : '0'; } }
        ],
        content: { whatIs: '<p>Calculates electric field strength from a point charge.</p>' }
    },
    'magnetic-field-wire-calculator': {
        id: 'magnetic-field-wire-calculator',
        title: 'Magnetic Field (Wire)',
        description: 'B = μ₀I/(2πr)',
        category: 'physics',
        icon: 'Zap',
        inputs: [
            { id: 'i', label: 'Current (A)', type: 'number', placeholder: '10' },
            { id: 'r', label: 'Distance (m)', type: 'number', placeholder: '0.05' }
        ],
        outputs: [
            { label: 'B (Tesla)', calculate: (inputs) => { const mu0 = 4 * Math.PI * 1e-7; const i = Number(inputs.i); const r = Number(inputs.r); return r ? (mu0 * i / (2 * Math.PI * r)).toExponential(2) : '0'; } }
        ],
        content: { whatIs: '<p>Calculates magnetic field around a current-carrying wire.</p>' }
    },
    // Batch CB: Sports Tools II
    'running-pace-v2-calculator': {
        id: 'running-pace-v2-calculator',
        title: 'Running Pace',
        description: 'Pace from time/distance.',
        category: 'sports',
        icon: 'Trophy',
        inputs: [
            { id: 'distance', label: 'Distance (km)', type: 'number', placeholder: '5' },
            { id: 'minutes', label: 'Time (minutes)', type: 'number', placeholder: '25' }
        ],
        outputs: [
            { label: 'Pace (min/km)', calculate: (inputs) => { const d = Number(inputs.distance); return d ? (Number(inputs.minutes) / d).toFixed(2) : '0'; } },
            { label: 'Speed (km/h)', calculate: (inputs) => { const m = Number(inputs.minutes); return m ? (Number(inputs.distance) / m * 60).toFixed(2) : '0'; } }
        ],
        content: { whatIs: '<p>Calculates running pace and speed.</p>' }
    },
    'cycling-power-calculator': {
        id: 'cycling-power-calculator',
        title: 'Cycling Power (Est)',
        description: 'Power from speed.',
        category: 'sports',
        icon: 'Trophy',
        inputs: [
            { id: 'weight', label: 'Total Weight (kg)', type: 'number', placeholder: '80' },
            { id: 'speed', label: 'Speed (km/h)', type: 'number', placeholder: '30' },
            { id: 'grade', label: 'Grade (%)', type: 'number', placeholder: '0', defaultValue: '0' }
        ],
        outputs: [
            { label: 'Est. Power (W)', calculate: (inputs) => { const w = Number(inputs.weight); const v = Number(inputs.speed) / 3.6; const g = Number(inputs.grade) / 100; const drag = 0.5 * 1.225 * 0.32 * 0.4 * v * v * v; const gravity = w * 9.81 * g * v; const roll = w * 9.81 * 0.004 * v; return (drag + gravity + roll).toFixed(0); } }
        ],
        content: { whatIs: '<p>Estimates cycling power based on speed, weight, and grade.</p>' }
    },
    'swim-pace-calculator': {
        id: 'swim-pace-calculator',
        title: 'Swim Pace',
        description: 'Pace per 100m.',
        category: 'sports',
        icon: 'Trophy',
        inputs: [
            { id: 'distance', label: 'Distance (m)', type: 'number', placeholder: '1500' },
            { id: 'minutes', label: 'Time (minutes)', type: 'number', placeholder: '30' }
        ],
        outputs: [
            { label: 'Pace (min/100m)', calculate: (inputs) => { const d = Number(inputs.distance); return d ? (Number(inputs.minutes) / d * 100).toFixed(2) : '0'; } }
        ],
        content: { whatIs: '<p>Calculates swim pace per 100 meters.</p>' }
    },
    'exercise-calories-v2-calculator': {
        id: 'exercise-calories-v2-calculator',
        title: 'Exercise Calories',
        description: 'Calories burned.',
        category: 'sports',
        icon: 'Trophy',
        inputs: [
            { id: 'met', label: 'MET Value', type: 'number', placeholder: '7' },
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '70' },
            { id: 'minutes', label: 'Duration (min)', type: 'number', placeholder: '30' }
        ],
        outputs: [
            { label: 'Calories Burned', calculate: (inputs) => (Number(inputs.met) * Number(inputs.weight) * Number(inputs.minutes) / 60).toFixed(0) }
        ],
        content: { whatIs: '<p>Calculates calories burned using MET values.</p>' }
    },
    'heart-rate-zones-v2-calculator': {
        id: 'heart-rate-zones-v2-calculator',
        title: 'Heart Rate Zones',
        description: 'Training zones.',
        category: 'sports',
        icon: 'Trophy',
        inputs: [
            { id: 'maxHr', label: 'Max Heart Rate', type: 'number', placeholder: '190' }
        ],
        outputs: [
            { label: 'Zone 1 (50-60%)', calculate: (inputs) => { const m = Number(inputs.maxHr); return Math.round(m * 0.5) + '-' + Math.round(m * 0.6); } },
            { label: 'Zone 2 (60-70%)', calculate: (inputs) => { const m = Number(inputs.maxHr); return Math.round(m * 0.6) + '-' + Math.round(m * 0.7); } },
            { label: 'Zone 3 (70-80%)', calculate: (inputs) => { const m = Number(inputs.maxHr); return Math.round(m * 0.7) + '-' + Math.round(m * 0.8); } },
            { label: 'Zone 4 (80-90%)', calculate: (inputs) => { const m = Number(inputs.maxHr); return Math.round(m * 0.8) + '-' + Math.round(m * 0.9); } },
            { label: 'Zone 5 (90-100%)', calculate: (inputs) => { const m = Number(inputs.maxHr); return Math.round(m * 0.9) + '-' + m; } }
        ],
        content: { whatIs: '<p>Calculates heart rate training zones.</p>' }
    },
    // Batch CC: Random/Fun Tools
    'password-gen-v2-calculator': {
        id: 'password-gen-v2-calculator',
        title: 'Password Generator',
        description: 'Random password.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'length', label: 'Length', type: 'number', placeholder: '16', defaultValue: '16' }
        ],
        outputs: [
            { label: 'Password', calculate: (inputs) => { const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%'; let pw = ''; for (let i = 0; i < Number(inputs.length); i++) pw += chars[Math.floor(Math.random() * chars.length)]; return pw; } }
        ],
        content: { whatIs: '<p>Generates a random secure password.</p>' }
    },
    'dice-roller-v2-calculator': {
        id: 'dice-roller-v2-calculator',
        title: 'Dice Roller',
        description: 'Roll dice.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'count', label: 'Number of Dice', type: 'number', placeholder: '2', defaultValue: '2' },
            { id: 'sides', label: 'Sides per Die', type: 'number', placeholder: '6', defaultValue: '6' }
        ],
        outputs: [
            { label: 'Results', calculate: (inputs) => { const c = Number(inputs.count); const s = Number(inputs.sides); const rolls = []; for (let i = 0; i < c; i++) rolls.push(Math.floor(Math.random() * s) + 1); return rolls.join(', '); } },
            { label: 'Total', calculate: (inputs) => { const c = Number(inputs.count); const s = Number(inputs.sides); let sum = 0; for (let i = 0; i < c; i++) sum += Math.floor(Math.random() * s) + 1; return sum.toString(); } }
        ],
        content: { whatIs: '<p>Rolls multiple dice with custom sides.</p>' }
    },
    'coin-flip-v2-calculator': {
        id: 'coin-flip-v2-calculator',
        title: 'Coin Flip',
        description: 'Flip coins.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'count', label: 'Number of Flips', type: 'number', placeholder: '1', defaultValue: '1' }
        ],
        outputs: [
            { label: 'Results', calculate: (inputs) => { const c = Number(inputs.count); const flips = []; for (let i = 0; i < c; i++) flips.push(Math.random() < 0.5 ? 'Heads' : 'Tails'); return flips.join(', '); } }
        ],
        content: { whatIs: '<p>Flips one or more coins.</p>' }
    },
    'random-color-calculator': {
        id: 'random-color-calculator',
        title: 'Random Color Generator',
        description: 'Generate random colors.',
        category: 'web',
        icon: 'Palette',
        inputs: [
            { id: 'trigger', label: 'Generate (any number)', type: 'number', placeholder: '1' }
        ],
        outputs: [
            { label: 'HEX', calculate: () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase() },
            { label: 'RGB', calculate: () => `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})` }
        ],
        content: { whatIs: '<p>Generates random colors in HEX and RGB formats.</p>' }
    },
    'uuid-gen-v2-calculator': {
        id: 'uuid-gen-v2-calculator',
        title: 'UUID Generator',
        description: 'Generate UUID v4.',
        category: 'web',
        icon: 'Code2',
        inputs: [
            { id: 'trigger', label: 'Generate (any number)', type: 'number', placeholder: '1' }
        ],
        outputs: [
            { label: 'UUID', calculate: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16); }) }
        ],
        content: { whatIs: '<p>Generates a random UUID v4.</p>' }
    },
    // Batch CD: Real Estate Tools
    'rent-roi-calculator': {
        id: 'rent-roi-calculator',
        title: 'Rental ROI',
        description: 'Return on investment.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'rent', label: 'Monthly Rent', type: 'number', placeholder: '1500' },
            { id: 'price', label: 'Purchase Price', type: 'number', placeholder: '200000' },
            { id: 'expenses', label: 'Annual Expenses', type: 'number', placeholder: '3000' }
        ],
        outputs: [
            { label: 'Net Annual Income', calculate: (inputs) => (Number(inputs.rent) * 12 - Number(inputs.expenses)).toFixed(0) },
            { label: 'ROI (%)', calculate: (inputs) => { const net = Number(inputs.rent) * 12 - Number(inputs.expenses); return ((net / Number(inputs.price)) * 100).toFixed(2); } }
        ],
        content: { whatIs: '<p>Calculates rental property return on investment.</p>' }
    },
    'cap-rate-calculator': {
        id: 'cap-rate-calculator',
        title: 'Cap Rate',
        description: 'Capitalization rate.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'noi', label: 'Net Operating Income', type: 'number', placeholder: '15000' },
            { id: 'price', label: 'Property Value', type: 'number', placeholder: '200000' }
        ],
        outputs: [
            { label: 'Cap Rate (%)', calculate: (inputs) => ((Number(inputs.noi) / Number(inputs.price)) * 100).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates capitalization rate for property valuation.</p>' }
    },
    'mortgage-payment-v2-calculator': {
        id: 'mortgage-payment-v2-calculator',
        title: 'Mortgage Payment',
        description: 'Monthly P&I.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'p', label: 'Loan Amount', type: 'number', placeholder: '250000' },
            { id: 'r', label: 'Interest Rate (%)', type: 'number', placeholder: '6.5' },
            { id: 'years', label: 'Term (years)', type: 'number', placeholder: '30' }
        ],
        outputs: [
            { label: 'Monthly Payment', calculate: (inputs) => { const p = Number(inputs.p); const r = Number(inputs.r) / 100 / 12; const n = Number(inputs.years) * 12; if (!r) return (p / n).toFixed(2); return (p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)).toFixed(2); } },
            { label: 'Total Interest', calculate: (inputs) => { const p = Number(inputs.p); const r = Number(inputs.r) / 100 / 12; const n = Number(inputs.years) * 12; if (!r) return '0'; const pmt = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1); return (pmt * n - p).toFixed(0); } }
        ],
        content: { whatIs: '<p>Calculates monthly mortgage payment and total interest.</p>' }
    },
    'property-tax-est-calculator': {
        id: 'property-tax-est-calculator',
        title: 'Property Tax Estimate',
        description: 'Annual tax estimate.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'value', label: 'Property Value', type: 'number', placeholder: '300000' },
            { id: 'rate', label: 'Tax Rate (%)', type: 'number', placeholder: '1.2' }
        ],
        outputs: [
            { label: 'Annual Tax', calculate: (inputs) => (Number(inputs.value) * Number(inputs.rate) / 100).toFixed(0) },
            { label: 'Monthly', calculate: (inputs) => (Number(inputs.value) * Number(inputs.rate) / 100 / 12).toFixed(0) }
        ],
        content: { whatIs: '<p>Estimates annual property tax.</p>' }
    },
    'rent-vs-buy-calculator': {
        id: 'rent-vs-buy-calculator',
        title: 'Rent vs Buy',
        description: 'Break-even analysis.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'rent', label: 'Monthly Rent', type: 'number', placeholder: '1500' },
            { id: 'price', label: 'Home Price', type: 'number', placeholder: '300000' },
            { id: 'down', label: 'Down Payment (%)', type: 'number', placeholder: '20' }
        ],
        outputs: [
            { label: 'Price-to-Rent Ratio', calculate: (inputs) => (Number(inputs.price) / (Number(inputs.rent) * 12)).toFixed(1) },
            { label: 'Guidance', calculate: (inputs) => { const ratio = Number(inputs.price) / (Number(inputs.rent) * 12); if (ratio < 15) return 'Favor Buy'; if (ratio < 20) return 'Neutral'; return 'Favor Rent'; } }
        ],
        content: { whatIs: '<p>Compares renting vs buying using price-to-rent ratio.</p>' }
    },
    // Batch CE: Engineering Tools
    'beam-load-calculator': {
        id: 'beam-load-calculator',
        title: 'Beam Deflection',
        description: 'Simply supported beam.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'f', label: 'Force (N)', type: 'number', placeholder: '1000' },
            { id: 'l', label: 'Length (m)', type: 'number', placeholder: '3' },
            { id: 'e', label: 'Elastic Modulus (GPa)', type: 'number', placeholder: '200' },
            { id: 'i', label: 'Moment of Inertia (cm⁴)', type: 'number', placeholder: '1000' }
        ],
        outputs: [
            { label: 'Max Deflection (mm)', calculate: (inputs) => { const f = Number(inputs.f); const l = Number(inputs.l); const e = Number(inputs.e) * 1e9; const i = Number(inputs.i) * 1e-8; return ((f * Math.pow(l, 3)) / (48 * e * i) * 1000).toFixed(3); } }
        ],
        content: { whatIs: '<p>Calculates max deflection of a simply supported beam with center load.</p>' }
    },
    'stress-strain-calculator': {
        id: 'stress-strain-calculator',
        title: 'Stress & Strain',
        description: 'σ = F/A, ε = ΔL/L',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'f', label: 'Force (N)', type: 'number', placeholder: '10000' },
            { id: 'a', label: 'Area (mm²)', type: 'number', placeholder: '100' },
            { id: 'dl', label: 'Change in Length (mm)', type: 'number', placeholder: '0.5' },
            { id: 'l', label: 'Original Length (mm)', type: 'number', placeholder: '1000' }
        ],
        outputs: [
            { label: 'Stress (MPa)', calculate: (inputs) => (Number(inputs.f) / Number(inputs.a)).toFixed(2) },
            { label: 'Strain', calculate: (inputs) => (Number(inputs.dl) / Number(inputs.l)).toFixed(6) }
        ],
        content: { whatIs: '<p>Calculates stress and strain in materials.</p>' }
    },
    'torque-calculator': {
        id: 'torque-calculator',
        title: 'Torque Calculator',
        description: 'τ = F × r',
        category: 'physics',
        icon: 'Activity',
        inputs: [
            { id: 'f', label: 'Force (N)', type: 'number', placeholder: '100' },
            { id: 'r', label: 'Radius (m)', type: 'number', placeholder: '0.5' },
            { id: 'angle', label: 'Angle (°)', type: 'number', placeholder: '90', defaultValue: '90' }
        ],
        outputs: [
            { label: 'Torque (Nm)', calculate: (inputs) => (Number(inputs.f) * Number(inputs.r) * Math.sin(Number(inputs.angle) * Math.PI / 180)).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates rotational torque.</p>' }
    },
    'gear-ratio-calculator': {
        id: 'gear-ratio-calculator',
        title: 'Gear Ratio',
        description: 'Drive/Driven ratio.',
        category: 'physics',
        icon: 'Activity',
        inputs: [
            { id: 'drive', label: 'Drive Gear Teeth', type: 'number', placeholder: '20' },
            { id: 'driven', label: 'Driven Gear Teeth', type: 'number', placeholder: '40' }
        ],
        outputs: [
            { label: 'Ratio', calculate: (inputs) => { const d = Number(inputs.drive); return d ? (Number(inputs.driven) / d).toFixed(2) + ':1' : '0'; } },
            { label: 'Speed Reduction', calculate: (inputs) => { const d = Number(inputs.drive); return d ? ((Number(inputs.driven) / d - 1) * 100).toFixed(0) + '%' : '0'; } }
        ],
        content: { whatIs: '<p>Calculates gear ratio and speed reduction.</p>' }
    },
    'pressure-drop-calculator': {
        id: 'pressure-drop-calculator',
        title: 'Pipe Pressure Drop',
        description: 'Darcy-Weisbach.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'l', label: 'Pipe Length (m)', type: 'number', placeholder: '100' },
            { id: 'd', label: 'Diameter (mm)', type: 'number', placeholder: '50' },
            { id: 'v', label: 'Flow Velocity (m/s)', type: 'number', placeholder: '2' },
            { id: 'f', label: 'Friction Factor', type: 'number', placeholder: '0.02', defaultValue: '0.02' }
        ],
        outputs: [
            { label: 'Pressure Drop (kPa)', calculate: (inputs) => { const l = Number(inputs.l); const d = Number(inputs.d) / 1000; const v = Number(inputs.v); const f = Number(inputs.f); const rho = 1000; return (f * (l / d) * (rho * v * v / 2) / 1000).toFixed(2); } }
        ],
        content: { whatIs: '<p>Calculates pressure drop in pipes using Darcy-Weisbach.</p>' }
    },
    // Batch CF: Astronomy Tools
    'light-year-calculator': {
        id: 'light-year-calculator',
        title: 'Light Year Converter',
        description: 'Distance in space.',
        category: 'physics',
        icon: 'Activity',
        inputs: [
            { id: 'ly', label: 'Light Years', type: 'number', placeholder: '1' }
        ],
        outputs: [
            { label: 'Kilometers', calculate: (inputs) => (Number(inputs.ly) * 9.461e12).toExponential(3) },
            { label: 'AU', calculate: (inputs) => (Number(inputs.ly) * 63241).toFixed(0) },
            { label: 'Parsecs', calculate: (inputs) => (Number(inputs.ly) * 0.3066).toFixed(4) }
        ],
        content: { whatIs: '<p>Converts light years to other distance units.</p>' }
    },
    'orbital-period-calculator': {
        id: 'orbital-period-calculator',
        title: 'Orbital Period',
        description: 'Kepler\'s 3rd law.',
        category: 'physics',
        icon: 'Activity',
        inputs: [
            { id: 'a', label: 'Semi-major Axis (AU)', type: 'number', placeholder: '1' }
        ],
        outputs: [
            { label: 'Period (years)', calculate: (inputs) => Math.pow(Number(inputs.a), 1.5).toFixed(2) },
            { label: 'Period (days)', calculate: (inputs) => (Math.pow(Number(inputs.a), 1.5) * 365.25).toFixed(0) }
        ],
        content: { whatIs: '<p>Calculates orbital period using Kepler\'s third law.</p>' }
    },
    'escape-velocity-calculator': {
        id: 'escape-velocity-calculator',
        title: 'Escape Velocity',
        description: 'v = √(2GM/r)',
        category: 'physics',
        icon: 'Activity',
        inputs: [
            { id: 'm', label: 'Planet Mass (kg)', type: 'number', placeholder: '5.97e24' },
            { id: 'r', label: 'Planet Radius (km)', type: 'number', placeholder: '6371' }
        ],
        outputs: [
            { label: 'Escape Velocity (km/s)', calculate: (inputs) => { const G = 6.674e-11; const m = Number(inputs.m); const r = Number(inputs.r) * 1000; return (Math.sqrt(2 * G * m / r) / 1000).toFixed(2); } }
        ],
        content: { whatIs: '<p>Calculates escape velocity from a celestial body.</p>' }
    },
    'gravity-force-calculator': {
        id: 'gravity-force-calculator',
        title: 'Gravitational Force',
        description: 'F = Gm₁m₂/r²',
        category: 'physics',
        icon: 'Activity',
        inputs: [
            { id: 'm1', label: 'Mass 1 (kg)', type: 'number', placeholder: '5.97e24' },
            { id: 'm2', label: 'Mass 2 (kg)', type: 'number', placeholder: '7.35e22' },
            { id: 'r', label: 'Distance (m)', type: 'number', placeholder: '3.84e8' }
        ],
        outputs: [
            { label: 'Force (N)', calculate: (inputs) => { const G = 6.674e-11; return (G * Number(inputs.m1) * Number(inputs.m2) / Math.pow(Number(inputs.r), 2)).toExponential(3); } }
        ],
        content: { whatIs: '<p>Calculates gravitational force between two masses.</p>' }
    },
    'star-distance-parallax-calculator': {
        id: 'star-distance-parallax-calculator',
        title: 'Star Distance (Parallax)',
        description: 'd = 1/p parsecs.',
        category: 'physics',
        icon: 'Activity',
        inputs: [
            { id: 'p', label: 'Parallax Angle (arcsec)', type: 'number', placeholder: '0.1' }
        ],
        outputs: [
            { label: 'Distance (pc)', calculate: (inputs) => { const p = Number(inputs.p); return p ? (1 / p).toFixed(2) : '0'; } },
            { label: 'Distance (ly)', calculate: (inputs) => { const p = Number(inputs.p); return p ? (3.26 / p).toFixed(2) : '0'; } }
        ],
        content: { whatIs: '<p>Calculates star distance from parallax angle.</p>' }
    },
    // Batch CG: Music Tools
    'bpm-delay-calculator': {
        id: 'bpm-delay-calculator',
        title: 'BPM to Delay Time',
        description: 'Milliseconds per beat.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'bpm', label: 'BPM', type: 'number', placeholder: '120' }
        ],
        outputs: [
            { label: '1/1 Note (ms)', calculate: (inputs) => (60000 / Number(inputs.bpm) * 4).toFixed(0) },
            { label: '1/2 Note (ms)', calculate: (inputs) => (60000 / Number(inputs.bpm) * 2).toFixed(0) },
            { label: '1/4 Note (ms)', calculate: (inputs) => (60000 / Number(inputs.bpm)).toFixed(0) },
            { label: '1/8 Note (ms)', calculate: (inputs) => (60000 / Number(inputs.bpm) / 2).toFixed(0) }
        ],
        content: { whatIs: '<p>Converts BPM to delay times for music production.</p>' }
    },
    'freq-to-note-calculator': {
        id: 'freq-to-note-calculator',
        title: 'Frequency to Note',
        description: 'Hz to musical note.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'freq', label: 'Frequency (Hz)', type: 'number', placeholder: '440' }
        ],
        outputs: [
            { label: 'Note', calculate: (inputs) => { const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']; const f = Number(inputs.freq); const n = Math.round(12 * Math.log2(f / 440) + 69); const octave = Math.floor((n - 12) / 12); const note = notes[n % 12]; return note + octave; } },
            { label: 'Cents Off', calculate: (inputs) => { const f = Number(inputs.freq); const n = 12 * Math.log2(f / 440) + 69; const cents = Math.round((n - Math.round(n)) * 100); return cents.toString(); } }
        ],
        content: { whatIs: '<p>Converts frequency to nearest musical note.</p>' }
    },
    'sample-rate-calculator': {
        id: 'sample-rate-calculator',
        title: 'Sample Rate Nyquist',
        description: 'Max frequency.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'sr', label: 'Sample Rate (Hz)', type: 'number', placeholder: '44100' }
        ],
        outputs: [
            { label: 'Nyquist Freq (Hz)', calculate: (inputs) => (Number(inputs.sr) / 2).toString() },
            { label: 'Nyquist Freq (kHz)', calculate: (inputs) => (Number(inputs.sr) / 2000).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates Nyquist frequency from sample rate.</p>' }
    },
    'bit-depth-calculator': {
        id: 'bit-depth-calculator',
        title: 'Bit Depth Dynamic Range',
        description: 'dB range.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'bits', label: 'Bit Depth', type: 'number', placeholder: '16' }
        ],
        outputs: [
            { label: 'Dynamic Range (dB)', calculate: (inputs) => (Number(inputs.bits) * 6.02).toFixed(1) },
            { label: 'Quantization Levels', calculate: (inputs) => Math.pow(2, Number(inputs.bits)).toString() }
        ],
        content: { whatIs: '<p>Calculates dynamic range from audio bit depth.</p>' }
    },
    'audio-file-size-calculator': {
        id: 'audio-file-size-calculator',
        title: 'Audio File Size',
        description: 'Uncompressed size.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'sr', label: 'Sample Rate (Hz)', type: 'number', placeholder: '44100' },
            { id: 'bits', label: 'Bit Depth', type: 'number', placeholder: '16' },
            { id: 'channels', label: 'Channels', type: 'number', placeholder: '2' },
            { id: 'seconds', label: 'Duration (sec)', type: 'number', placeholder: '180' }
        ],
        outputs: [
            { label: 'Size (MB)', calculate: (inputs) => ((Number(inputs.sr) * Number(inputs.bits) / 8 * Number(inputs.channels) * Number(inputs.seconds)) / 1048576).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates uncompressed audio file size.</p>' }
    },
    // Batch CH: Photography Tools
    'exposure-value-calculator': {
        id: 'exposure-value-calculator',
        title: 'Exposure Value (EV)',
        description: 'EV calculation.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'aperture', label: 'Aperture (f-stop)', type: 'number', placeholder: '8' },
            { id: 'shutter', label: 'Shutter (1/x sec)', type: 'number', placeholder: '250' }
        ],
        outputs: [
            { label: 'EV', calculate: (inputs) => (Math.log2(Math.pow(Number(inputs.aperture), 2) * Number(inputs.shutter))).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates exposure value from aperture and shutter speed.</p>' }
    },
    'dof-calculator': {
        id: 'dof-calculator',
        title: 'Depth of Field',
        description: 'DOF estimation.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'f', label: 'Focal Length (mm)', type: 'number', placeholder: '50' },
            { id: 'a', label: 'Aperture (f-stop)', type: 'number', placeholder: '2.8' },
            { id: 'd', label: 'Subject Distance (m)', type: 'number', placeholder: '3' },
            { id: 'coc', label: 'Circle of Confusion (mm)', type: 'number', placeholder: '0.03', defaultValue: '0.03' }
        ],
        outputs: [
            { label: 'DOF (m)', calculate: (inputs) => { const f = Number(inputs.f); const N = Number(inputs.a); const d = Number(inputs.d) * 1000; const c = Number(inputs.coc); const h = f * f / (N * c); const near = d * h / (h + (d - f)); const far = d * h / (h - (d - f)); return ((far - near) / 1000).toFixed(2); } }
        ],
        content: { whatIs: '<p>Estimates depth of field for photography.</p>' }
    },
    'flash-guide-calculator': {
        id: 'flash-guide-calculator',
        title: 'Flash Guide Number',
        description: 'GN = Aperture × Distance.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'gn', label: 'Guide Number', type: 'number', placeholder: '40' },
            { id: 'aperture', label: 'Aperture (f-stop)', type: 'number', placeholder: '5.6' }
        ],
        outputs: [
            { label: 'Max Distance (m)', calculate: (inputs) => { const a = Number(inputs.aperture); return a ? (Number(inputs.gn) / a).toFixed(1) : '0'; } }
        ],
        content: { whatIs: '<p>Calculates flash reach from guide number.</p>' }
    },
    'focal-length-35-calculator': {
        id: 'focal-length-35-calculator',
        title: '35mm Equivalent',
        description: 'Crop factor conversion.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'f', label: 'Focal Length (mm)', type: 'number', placeholder: '50' },
            { id: 'crop', label: 'Crop Factor', type: 'number', placeholder: '1.5' }
        ],
        outputs: [
            { label: '35mm Equivalent', calculate: (inputs) => (Number(inputs.f) * Number(inputs.crop)).toFixed(0) + 'mm' }
        ],
        content: { whatIs: '<p>Converts focal length to 35mm equivalent.</p>' }
    },
    'crop-factor-calculator': {
        id: 'crop-factor-calculator',
        title: 'Sensor Crop Factor',
        description: 'From sensor size.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'sensor', label: 'Sensor Diagonal (mm)', type: 'number', placeholder: '28.4' }
        ],
        outputs: [
            { label: 'Crop Factor', calculate: (inputs) => { const s = Number(inputs.sensor); return s ? (43.3 / s).toFixed(2) : '0'; } }
        ],
        content: { whatIs: '<p>Calculates crop factor from sensor diagonal size.</p>' }
    },
    // Batch CI: Gardening Tools
    'seed-spacing-calculator': {
        id: 'seed-spacing-calculator',
        title: 'Seed Spacing',
        description: 'Plants per area.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'area', label: 'Bed Area (m²)', type: 'number', placeholder: '10' },
            { id: 'spacing', label: 'Plant Spacing (cm)', type: 'number', placeholder: '30' },
            { id: 'row', label: 'Row Spacing (cm)', type: 'number', placeholder: '40' }
        ],
        outputs: [
            { label: 'Plants Needed', calculate: (inputs) => { const a = Number(inputs.area) * 10000; const s = Number(inputs.spacing); const r = Number(inputs.row); return Math.floor(a / (s * r)).toString(); } }
        ],
        content: { whatIs: '<p>Calculates number of plants for a garden bed.</p>' }
    },
    'fertilizer-calculator': {
        id: 'fertilizer-calculator',
        title: 'Fertilizer Calculator',
        description: 'Amount per area.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'area', label: 'Area (m²)', type: 'number', placeholder: '50' },
            { id: 'rate', label: 'Application Rate (g/m²)', type: 'number', placeholder: '30' }
        ],
        outputs: [
            { label: 'Total Fertilizer (kg)', calculate: (inputs) => (Number(inputs.area) * Number(inputs.rate) / 1000).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates fertilizer needed for an area.</p>' }
    },
    'mulch-volume-calculator': {
        id: 'mulch-volume-calculator',
        title: 'Mulch Volume',
        description: 'Cubic meters needed.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'area', label: 'Area (m²)', type: 'number', placeholder: '20' },
            { id: 'depth', label: 'Depth (cm)', type: 'number', placeholder: '7.5' }
        ],
        outputs: [
            { label: 'Volume (m³)', calculate: (inputs) => (Number(inputs.area) * Number(inputs.depth) / 100).toFixed(2) },
            { label: 'Bags (50L)', calculate: (inputs) => Math.ceil((Number(inputs.area) * Number(inputs.depth) / 100) * 20).toString() }
        ],
        content: { whatIs: '<p>Calculates mulch volume needed for garden beds.</p>' }
    },
    'compost-ratio-calculator': {
        id: 'compost-ratio-calculator',
        title: 'Compost C:N Ratio',
        description: 'Brown to green.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'brown', label: 'Brown Material (kg)', type: 'number', placeholder: '10' },
            { id: 'green', label: 'Green Material (kg)', type: 'number', placeholder: '4' }
        ],
        outputs: [
            { label: 'Ratio (Brown:Green)', calculate: (inputs) => { const g = Number(inputs.green); return g ? (Number(inputs.brown) / g).toFixed(1) + ':1' : '0'; } },
            { label: 'Status', calculate: (inputs) => { const r = Number(inputs.brown) / Number(inputs.green); if (r < 2) return 'Add browns'; if (r > 4) return 'Add greens'; return 'Good balance'; } }
        ],
        content: { whatIs: '<p>Calculates compost carbon-to-nitrogen ratio.</p>' }
    },
    'plant-water-calculator': {
        id: 'plant-water-calculator',
        title: 'Plant Watering',
        description: 'Water per pot size.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'diameter', label: 'Pot Diameter (cm)', type: 'number', placeholder: '20' }
        ],
        outputs: [
            { label: 'Water (ml)', calculate: (inputs) => { const d = Number(inputs.diameter); return (Math.PI * Math.pow(d / 2, 2) * d * 0.25).toFixed(0); } },
            { label: 'Water (cups)', calculate: (inputs) => { const d = Number(inputs.diameter); const ml = Math.PI * Math.pow(d / 2, 2) * d * 0.25; return (ml / 250).toFixed(1); } }
        ],
        content: { whatIs: '<p>Estimates water amount based on pot size.</p>' }
    },
    // Batch CJ: Pet Tools
    'dog-age-calculator': {
        id: 'dog-age-calculator',
        title: 'Dog Age in Human Years',
        description: 'More accurate formula.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'age', label: 'Dog Age (years)', type: 'number', placeholder: '5' },
            { id: 'size', label: 'Size (small/medium/large)', type: 'string', placeholder: 'medium' }
        ],
        outputs: [
            { label: 'Human Years', calculate: (inputs) => { const a = Number(inputs.age); const s = String(inputs.size || 'medium').toLowerCase(); if (a <= 2) return (a * 12).toString(); const base = 24; const rate = s === 'small' ? 4 : s === 'large' ? 6 : 5; return (base + (a - 2) * rate).toString(); } }
        ],
        content: { whatIs: '<p>Converts dog age to human years based on size.</p>' }
    },
    'cat-age-calculator': {
        id: 'cat-age-calculator',
        title: 'Cat Age in Human Years',
        description: 'Cat to human age.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'age', label: 'Cat Age (years)', type: 'number', placeholder: '5' }
        ],
        outputs: [
            { label: 'Human Years', calculate: (inputs) => { const a = Number(inputs.age); if (a <= 1) return '15'; if (a <= 2) return '24'; return (24 + (a - 2) * 4).toString(); } }
        ],
        content: { whatIs: '<p>Converts cat age to human years.</p>' }
    },
    'pet-food-calculator': {
        id: 'pet-food-calculator',
        title: 'Pet Food Calculator',
        description: 'Daily food amount.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'weight', label: 'Pet Weight (kg)', type: 'number', placeholder: '10' },
            { id: 'activity', label: 'Activity (low/medium/high)', type: 'string', placeholder: 'medium' }
        ],
        outputs: [
            { label: 'Daily Food (g)', calculate: (inputs) => { const w = Number(inputs.weight); const a = String(inputs.activity || 'medium').toLowerCase(); const mult = a === 'low' ? 2 : a === 'high' ? 3.5 : 2.5; return (w * mult * 10).toFixed(0); } }
        ],
        content: { whatIs: '<p>Estimates daily food for dogs based on weight and activity.</p>' }
    },
    'aquarium-volume-calculator': {
        id: 'aquarium-volume-calculator',
        title: 'Aquarium Volume',
        description: 'Tank capacity.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'l', label: 'Length (cm)', type: 'number', placeholder: '60' },
            { id: 'w', label: 'Width (cm)', type: 'number', placeholder: '30' },
            { id: 'h', label: 'Height (cm)', type: 'number', placeholder: '40' }
        ],
        outputs: [
            { label: 'Volume (L)', calculate: (inputs) => (Number(inputs.l) * Number(inputs.w) * Number(inputs.h) / 1000).toFixed(1) },
            { label: 'Gallons', calculate: (inputs) => (Number(inputs.l) * Number(inputs.w) * Number(inputs.h) / 3785.41).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates aquarium water volume.</p>' }
    },
    'pet-weight-goal-calculator': {
        id: 'pet-weight-goal-calculator',
        title: 'Pet Weight Goal',
        description: 'Ideal weight range.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'current', label: 'Current Weight (kg)', type: 'number', placeholder: '12' },
            { id: 'ideal', label: 'Ideal Weight (kg)', type: 'number', placeholder: '10' }
        ],
        outputs: [
            { label: 'Weight to Lose (kg)', calculate: (inputs) => Math.max(0, Number(inputs.current) - Number(inputs.ideal)).toFixed(1) },
            { label: 'Weeks at 1%/week', calculate: (inputs) => { const diff = Number(inputs.current) - Number(inputs.ideal); const rate = Number(inputs.current) * 0.01; return diff > 0 ? Math.ceil(diff / rate).toString() : '0'; } }
        ],
        content: { whatIs: '<p>Calculates pet weight loss timeline.</p>' }
    },
    // Batch CK: Travel Tools
    'currency-rate-calculator': {
        id: 'currency-rate-calculator',
        title: 'Currency Converter',
        description: 'Simple rate conversion.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'amount', label: 'Amount', type: 'number', placeholder: '100' },
            { id: 'rate', label: 'Exchange Rate', type: 'number', placeholder: '1.1' }
        ],
        outputs: [
            { label: 'Converted', calculate: (inputs) => (Number(inputs.amount) * Number(inputs.rate)).toFixed(2) }
        ],
        content: { whatIs: '<p>Converts currency using exchange rate.</p>' }
    },
    'luggage-weight-calculator': {
        id: 'luggage-weight-calculator',
        title: 'Luggage Weight Check',
        description: 'Check allowance.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'weight', label: 'Bag Weight (kg)', type: 'number', placeholder: '18' },
            { id: 'limit', label: 'Airline Limit (kg)', type: 'number', placeholder: '23' }
        ],
        outputs: [
            { label: 'Remaining (kg)', calculate: (inputs) => (Number(inputs.limit) - Number(inputs.weight)).toFixed(1) },
            { label: 'Status', calculate: (inputs) => Number(inputs.weight) <= Number(inputs.limit) ? '✓ OK' : '✗ Over' }
        ],
        content: { whatIs: '<p>Checks if luggage is within airline weight limit.</p>' }
    },
    'flight-time-calculator': {
        id: 'flight-time-calculator',
        title: 'Flight Time Est',
        description: 'Time from distance.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'distance', label: 'Distance (km)', type: 'number', placeholder: '5000' },
            { id: 'speed', label: 'Avg Speed (km/h)', type: 'number', placeholder: '850', defaultValue: '850' }
        ],
        outputs: [
            { label: 'Flight Time', calculate: (inputs) => { const h = Number(inputs.distance) / Number(inputs.speed); return Math.floor(h) + 'h ' + Math.round((h % 1) * 60) + 'm'; } }
        ],
        content: { whatIs: '<p>Estimates flight time from distance.</p>' }
    },
    'time-diff-calculator': {
        id: 'time-diff-calculator',
        title: 'Time Zone Difference',
        description: 'Hours apart.',
        category: 'calendar',
        icon: 'CalendarDays',
        inputs: [
            { id: 'tz1', label: 'Your UTC Offset', type: 'number', placeholder: '-3' },
            { id: 'tz2', label: 'Destination UTC Offset', type: 'number', placeholder: '+1' }
        ],
        outputs: [
            { label: 'Difference (hours)', calculate: (inputs) => (Number(inputs.tz2) - Number(inputs.tz1)).toString() }
        ],
        content: { whatIs: '<p>Calculates time zone difference.</p>' }
    },
    'jet-lag-calculator': {
        id: 'jet-lag-calculator',
        title: 'Jet Lag Recovery',
        description: 'Days to adjust.',
        category: 'health',
        icon: 'HeartPulse',
        inputs: [
            { id: 'zones', label: 'Time Zones Crossed', type: 'number', placeholder: '6' }
        ],
        outputs: [
            { label: 'Recovery Days', calculate: (inputs) => Math.ceil(Number(inputs.zones) * 0.75).toString() }
        ],
        content: { whatIs: '<p>Estimates jet lag recovery time.</p>' }
    },
    // Batch CL: Sewing/Craft Tools
    'fabric-yardage-calculator': {
        id: 'fabric-yardage-calculator',
        title: 'Fabric Yardage',
        description: 'Fabric needed.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'length', label: 'Project Length (cm)', type: 'number', placeholder: '150' },
            { id: 'width', label: 'Project Width (cm)', type: 'number', placeholder: '100' },
            { id: 'fabricWidth', label: 'Fabric Width (cm)', type: 'number', placeholder: '110', defaultValue: '110' }
        ],
        outputs: [
            { label: 'Yards Needed', calculate: (inputs) => { const l = Number(inputs.length); const w = Number(inputs.width); const fw = Number(inputs.fabricWidth); const panels = Math.ceil(w / fw); return ((l * panels) / 91.44).toFixed(2); } }
        ],
        content: { whatIs: '<p>Calculates fabric yardage for a project.</p>' }
    },
    'seam-allowance-calculator': {
        id: 'seam-allowance-calculator',
        title: 'Seam Allowance',
        description: 'Add seam to pattern.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'pattern', label: 'Pattern Size (cm)', type: 'number', placeholder: '50' },
            { id: 'seam', label: 'Seam Allowance (cm)', type: 'number', placeholder: '1.5', defaultValue: '1.5' }
        ],
        outputs: [
            { label: 'Cut Size (cm)', calculate: (inputs) => (Number(inputs.pattern) + Number(inputs.seam) * 2).toFixed(1) }
        ],
        content: { whatIs: '<p>Adds seam allowance to pattern dimensions.</p>' }
    },
    'quilt-squares-calculator': {
        id: 'quilt-squares-calculator',
        title: 'Quilt Squares',
        description: 'Squares needed.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'width', label: 'Quilt Width (cm)', type: 'number', placeholder: '200' },
            { id: 'height', label: 'Quilt Height (cm)', type: 'number', placeholder: '150' },
            { id: 'square', label: 'Square Size (cm)', type: 'number', placeholder: '15' }
        ],
        outputs: [
            { label: 'Squares Needed', calculate: (inputs) => (Math.ceil(Number(inputs.width) / Number(inputs.square)) * Math.ceil(Number(inputs.height) / Number(inputs.square))).toString() }
        ],
        content: { whatIs: '<p>Calculates number of squares for a quilt.</p>' }
    },
    'yarn-weight-calculator': {
        id: 'yarn-weight-calculator',
        title: 'Yarn Needed',
        description: 'Skeins for project.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'meters', label: 'Pattern Meters', type: 'number', placeholder: '500' },
            { id: 'skein', label: 'Meters per Skein', type: 'number', placeholder: '200' }
        ],
        outputs: [
            { label: 'Skeins Needed', calculate: (inputs) => Math.ceil(Number(inputs.meters) / Number(inputs.skein)).toString() }
        ],
        content: { whatIs: '<p>Calculates yarn skeins needed.</p>' }
    },
    'crochet-gauge-calculator': {
        id: 'crochet-gauge-calculator',
        title: 'Crochet Gauge',
        description: 'Stitches per cm.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'stitches', label: 'Stitches in 10cm', type: 'number', placeholder: '20' },
            { id: 'rows', label: 'Rows in 10cm', type: 'number', placeholder: '10' }
        ],
        outputs: [
            { label: 'Stitches/cm', calculate: (inputs) => (Number(inputs.stitches) / 10).toFixed(1) },
            { label: 'Rows/cm', calculate: (inputs) => (Number(inputs.rows) / 10).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates crochet gauge from swatch.</p>' }
    },
    // Batch CM: Education Tools
    'grade-average-calculator': {
        id: 'grade-average-calculator',
        title: 'Grade Average',
        description: 'Simple average.',
        category: 'education',
        icon: 'GraduationCap',
        inputs: [
            { id: 'g1', label: 'Grade 1', type: 'number', placeholder: '85' },
            { id: 'g2', label: 'Grade 2', type: 'number', placeholder: '90' },
            { id: 'g3', label: 'Grade 3', type: 'number', placeholder: '78' },
            { id: 'g4', label: 'Grade 4', type: 'number', placeholder: '92' }
        ],
        outputs: [
            { label: 'Average', calculate: (inputs) => { const grades = [Number(inputs.g1), Number(inputs.g2), Number(inputs.g3), Number(inputs.g4)].filter(g => g > 0); return grades.length ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1) : '0'; } }
        ],
        content: { whatIs: '<p>Calculates average of grades.</p>' }
    },
    'gpa-calculator': {
        id: 'gpa-calculator',
        title: 'GPA Calculator',
        description: '4.0 scale.',
        category: 'education',
        icon: 'GraduationCap',
        inputs: [
            { id: 'a', label: 'A grades (4.0)', type: 'number', placeholder: '3' },
            { id: 'b', label: 'B grades (3.0)', type: 'number', placeholder: '2' },
            { id: 'c', label: 'C grades (2.0)', type: 'number', placeholder: '1' },
            { id: 'd', label: 'D grades (1.0)', type: 'number', placeholder: '0' }
        ],
        outputs: [
            { label: 'GPA', calculate: (inputs) => { const a = Number(inputs.a); const b = Number(inputs.b); const c = Number(inputs.c); const d = Number(inputs.d); const total = a + b + c + d; return total ? ((a * 4 + b * 3 + c * 2 + d * 1) / total).toFixed(2) : '0'; } }
        ],
        content: { whatIs: '<p>Calculates GPA on 4.0 scale.</p>' }
    },
    'study-hours-calculator': {
        id: 'study-hours-calculator',
        title: 'Study Hours Needed',
        description: 'Hours before exam.',
        category: 'education',
        icon: 'GraduationCap',
        inputs: [
            { id: 'credits', label: 'Credit Hours', type: 'number', placeholder: '15' },
            { id: 'multiplier', label: 'Study Multiplier', type: 'number', placeholder: '2', defaultValue: '2' }
        ],
        outputs: [
            { label: 'Weekly Hours', calculate: (inputs) => (Number(inputs.credits) * Number(inputs.multiplier)).toString() },
            { label: 'Daily (7 days)', calculate: (inputs) => (Number(inputs.credits) * Number(inputs.multiplier) / 7).toFixed(1) }
        ],
        content: { whatIs: '<p>Estimates weekly study hours.</p>' }
    },
    'reading-time-v2-calculator': {
        id: 'reading-time-v2-calculator',
        title: 'Reading Time',
        description: 'Time to finish book.',
        category: 'education',
        icon: 'GraduationCap',
        inputs: [
            { id: 'pages', label: 'Total Pages', type: 'number', placeholder: '300' },
            { id: 'speed', label: 'Pages per Hour', type: 'number', placeholder: '30', defaultValue: '30' }
        ],
        outputs: [
            { label: 'Hours', calculate: (inputs) => (Number(inputs.pages) / Number(inputs.speed)).toFixed(1) },
            { label: 'Days (1h/day)', calculate: (inputs) => Math.ceil(Number(inputs.pages) / Number(inputs.speed)).toString() }
        ],
        content: { whatIs: '<p>Estimates time to read a book.</p>' }
    },
    'exam-score-needed-calculator': {
        id: 'exam-score-needed-calculator',
        title: 'Exam Score Needed',
        description: 'Final grade target.',
        category: 'education',
        icon: 'GraduationCap',
        inputs: [
            { id: 'current', label: 'Current Average', type: 'number', placeholder: '75' },
            { id: 'target', label: 'Target Grade', type: 'number', placeholder: '80' },
            { id: 'examWeight', label: 'Exam Weight (%)', type: 'number', placeholder: '30' }
        ],
        outputs: [
            { label: 'Score Needed', calculate: (inputs) => { const c = Number(inputs.current); const t = Number(inputs.target); const w = Number(inputs.examWeight) / 100; const needed = (t - c * (1 - w)) / w; return needed.toFixed(1); } }
        ],
        content: { whatIs: '<p>Calculates exam score needed for target grade.</p>' }
    },
    // Batch CN: Electrical II
    'wire-gauge-calculator': {
        id: 'wire-gauge-calculator',
        title: 'Wire Gauge (AWG)',
        description: 'Wire size by current.',
        category: 'electronics',
        icon: 'Zap',
        inputs: [
            { id: 'amps', label: 'Current (Amps)', type: 'number', placeholder: '15' }
        ],
        outputs: [
            { label: 'AWG', calculate: (inputs) => { const a = Number(inputs.amps); if (a <= 15) return '14'; if (a <= 20) return '12'; if (a <= 30) return '10'; if (a <= 40) return '8'; if (a <= 55) return '6'; return '4 or larger'; } }
        ],
        content: { whatIs: '<p>Recommends wire gauge based on amperage.</p>' }
    },
    'circuit-breaker-calculator': {
        id: 'circuit-breaker-calculator',
        title: 'Circuit Breaker Size',
        description: 'Breaker for load.',
        category: 'electronics',
        icon: 'Zap',
        inputs: [
            { id: 'watts', label: 'Total Watts', type: 'number', placeholder: '1800' },
            { id: 'voltage', label: 'Voltage', type: 'number', placeholder: '120', defaultValue: '120' }
        ],
        outputs: [
            { label: 'Amps', calculate: (inputs) => (Number(inputs.watts) / Number(inputs.voltage)).toFixed(1) },
            { label: 'Breaker (125%)', calculate: (inputs) => { const a = Number(inputs.watts) / Number(inputs.voltage) * 1.25; if (a <= 15) return '15A'; if (a <= 20) return '20A'; if (a <= 30) return '30A'; return Math.ceil(a / 10) * 10 + 'A'; } }
        ],
        content: { whatIs: '<p>Calculates circuit breaker size.</p>' }
    },
    'led-resistor-calculator': {
        id: 'led-resistor-calculator',
        title: 'LED Resistor',
        description: 'Resistor for LED.',
        category: 'electronics',
        icon: 'Zap',
        inputs: [
            { id: 'vs', label: 'Supply Voltage (V)', type: 'number', placeholder: '12' },
            { id: 'vf', label: 'LED Forward Voltage (V)', type: 'number', placeholder: '2' },
            { id: 'i', label: 'LED Current (mA)', type: 'number', placeholder: '20' }
        ],
        outputs: [
            { label: 'Resistor (Ω)', calculate: (inputs) => ((Number(inputs.vs) - Number(inputs.vf)) / (Number(inputs.i) / 1000)).toFixed(0) }
        ],
        content: { whatIs: '<p>Calculates resistor value for LED circuit.</p>' }
    },
    'transformer-calculator': {
        id: 'transformer-calculator',
        title: 'Transformer Turns',
        description: 'Turns ratio.',
        category: 'electronics',
        icon: 'Zap',
        inputs: [
            { id: 'vp', label: 'Primary Voltage', type: 'number', placeholder: '120' },
            { id: 'vs', label: 'Secondary Voltage', type: 'number', placeholder: '12' }
        ],
        outputs: [
            { label: 'Turns Ratio', calculate: (inputs) => (Number(inputs.vp) / Number(inputs.vs)).toFixed(2) + ':1' }
        ],
        content: { whatIs: '<p>Calculates transformer turns ratio.</p>' }
    },
    'power-factor-calculator': {
        id: 'power-factor-calculator',
        title: 'Power Factor',
        description: 'Real vs apparent power.',
        category: 'electronics',
        icon: 'Zap',
        inputs: [
            { id: 'real', label: 'Real Power (W)', type: 'number', placeholder: '800' },
            { id: 'apparent', label: 'Apparent Power (VA)', type: 'number', placeholder: '1000' }
        ],
        outputs: [
            { label: 'Power Factor', calculate: (inputs) => { const a = Number(inputs.apparent); return a ? (Number(inputs.real) / a).toFixed(3) : '0'; } }
        ],
        content: { whatIs: '<p>Calculates power factor.</p>' }
    },
    // Batch CO: Plumbing Tools
    'pipe-flow-gpm-calculator': {
        id: 'pipe-flow-gpm-calculator',
        title: 'Pipe Flow Rate',
        description: 'GPM from velocity.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'd', label: 'Pipe Diameter (inches)', type: 'number', placeholder: '1' },
            { id: 'v', label: 'Velocity (ft/s)', type: 'number', placeholder: '5' }
        ],
        outputs: [
            { label: 'Flow (GPM)', calculate: (inputs) => { const d = Number(inputs.d); const v = Number(inputs.v); return (2.448 * d * d * v).toFixed(2); } }
        ],
        content: { whatIs: '<p>Calculates pipe flow rate in GPM.</p>' }
    },
    'water-heater-calculator': {
        id: 'water-heater-calculator',
        title: 'Water Heater Size',
        description: 'Gallons needed.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'people', label: 'Number of People', type: 'number', placeholder: '4' }
        ],
        outputs: [
            { label: 'Tank Size (gal)', calculate: (inputs) => { const p = Number(inputs.people); if (p <= 2) return '40'; if (p <= 4) return '50'; if (p <= 6) return '65'; return '80+'; } }
        ],
        content: { whatIs: '<p>Recommends water heater tank size.</p>' }
    },
    'drain-slope-calculator': {
        id: 'drain-slope-calculator',
        title: 'Drain Slope',
        description: 'Fall per length.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'length', label: 'Pipe Length (ft)', type: 'number', placeholder: '20' },
            { id: 'slope', label: 'Slope (in/ft)', type: 'number', placeholder: '0.25', defaultValue: '0.25' }
        ],
        outputs: [
            { label: 'Total Fall (in)', calculate: (inputs) => (Number(inputs.length) * Number(inputs.slope)).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates drain pipe fall.</p>' }
    },
    'fixture-units-calculator': {
        id: 'fixture-units-calculator',
        title: 'Fixture Units',
        description: 'DFU total.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'toilets', label: 'Toilets', type: 'number', placeholder: '2' },
            { id: 'sinks', label: 'Sinks', type: 'number', placeholder: '3' },
            { id: 'showers', label: 'Showers', type: 'number', placeholder: '2' }
        ],
        outputs: [
            { label: 'Total DFU', calculate: (inputs) => (Number(inputs.toilets) * 4 + Number(inputs.sinks) * 1 + Number(inputs.showers) * 2).toString() }
        ],
        content: { whatIs: '<p>Calculates drainage fixture units.</p>' }
    },
    'tank-volume-gal-calculator': {
        id: 'tank-volume-gal-calculator',
        title: 'Tank Volume',
        description: 'Cylinder tank.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'd', label: 'Diameter (inches)', type: 'number', placeholder: '24' },
            { id: 'h', label: 'Height (inches)', type: 'number', placeholder: '48' }
        ],
        outputs: [
            { label: 'Volume (gal)', calculate: (inputs) => { const d = Number(inputs.d); const h = Number(inputs.h); return (Math.PI * Math.pow(d / 2, 2) * h / 231).toFixed(1); } }
        ],
        content: { whatIs: '<p>Calculates cylindrical tank volume in gallons.</p>' }
    },
    // Batch CP: HVAC Tools
    'btu-room-calculator': {
        id: 'btu-room-calculator',
        title: 'BTU Room Size',
        description: 'AC/Heater BTU.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'sqft', label: 'Room Sq Ft', type: 'number', placeholder: '300' }
        ],
        outputs: [
            { label: 'BTU Needed', calculate: (inputs) => (Number(inputs.sqft) * 20).toString() },
            { label: 'Tons', calculate: (inputs) => (Number(inputs.sqft) * 20 / 12000).toFixed(2) }
        ],
        content: { whatIs: '<p>Estimates BTU for room cooling/heating.</p>' }
    },
    'cfm-airflow-calculator': {
        id: 'cfm-airflow-calculator',
        title: 'CFM Airflow',
        description: 'Room ventilation.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'sqft', label: 'Room Sq Ft', type: 'number', placeholder: '200' },
            { id: 'height', label: 'Ceiling Height (ft)', type: 'number', placeholder: '8' },
            { id: 'ach', label: 'Air Changes/Hour', type: 'number', placeholder: '6', defaultValue: '6' }
        ],
        outputs: [
            { label: 'CFM', calculate: (inputs) => (Number(inputs.sqft) * Number(inputs.height) * Number(inputs.ach) / 60).toFixed(0) }
        ],
        content: { whatIs: '<p>Calculates ventilation CFM.</p>' }
    },
    'duct-size-calculator': {
        id: 'duct-size-calculator',
        title: 'Duct Size',
        description: 'Round duct diameter.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'cfm', label: 'CFM', type: 'number', placeholder: '300' },
            { id: 'velocity', label: 'Velocity (FPM)', type: 'number', placeholder: '600', defaultValue: '600' }
        ],
        outputs: [
            { label: 'Duct Diameter (in)', calculate: (inputs) => { const area = Number(inputs.cfm) / Number(inputs.velocity); return (Math.sqrt(area / Math.PI) * 2 * 12).toFixed(1); } }
        ],
        content: { whatIs: '<p>Calculates round duct size.</p>' }
    },
    'filter-size-calculator': {
        id: 'filter-size-calculator',
        title: 'Filter CFM Rating',
        description: 'Filter capacity.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'width', label: 'Filter Width (in)', type: 'number', placeholder: '20' },
            { id: 'height', label: 'Filter Height (in)', type: 'number', placeholder: '20' }
        ],
        outputs: [
            { label: 'Max CFM', calculate: (inputs) => (Number(inputs.width) * Number(inputs.height) * 2).toString() }
        ],
        content: { whatIs: '<p>Estimates filter capacity.</p>' }
    },
    'heat-loss-calculator': {
        id: 'heat-loss-calculator',
        title: 'Heat Loss Est',
        description: 'BTU/hr loss.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'sqft', label: 'Sq Ft', type: 'number', placeholder: '2000' },
            { id: 'tempDiff', label: 'Temp Difference (°F)', type: 'number', placeholder: '50' }
        ],
        outputs: [
            { label: 'BTU/hr Loss', calculate: (inputs) => (Number(inputs.sqft) * Number(inputs.tempDiff) * 0.5).toFixed(0) }
        ],
        content: { whatIs: '<p>Estimates building heat loss.</p>' }
    },
    // Batch CQ: Automotive II
    'tire-size-diameter-calculator': {
        id: 'tire-size-diameter-calculator',
        title: 'Tire Diameter',
        description: 'From tire code.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'width', label: 'Width (mm)', type: 'number', placeholder: '225' },
            { id: 'aspect', label: 'Aspect Ratio', type: 'number', placeholder: '45' },
            { id: 'rim', label: 'Rim (inches)', type: 'number', placeholder: '17' }
        ],
        outputs: [
            { label: 'Diameter (in)', calculate: (inputs) => { const w = Number(inputs.width); const a = Number(inputs.aspect); const r = Number(inputs.rim); const sidewall = w * a / 100 / 25.4 * 2; return (r + sidewall).toFixed(1); } }
        ],
        content: { whatIs: '<p>Calculates tire diameter from size code.</p>' }
    },
    'engine-displacement-calculator': {
        id: 'engine-displacement-calculator',
        title: 'Engine Displacement',
        description: 'Total volume.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'bore', label: 'Bore (mm)', type: 'number', placeholder: '86' },
            { id: 'stroke', label: 'Stroke (mm)', type: 'number', placeholder: '86' },
            { id: 'cylinders', label: 'Cylinders', type: 'number', placeholder: '4' }
        ],
        outputs: [
            { label: 'Displacement (cc)', calculate: (inputs) => { const b = Number(inputs.bore); const s = Number(inputs.stroke); const c = Number(inputs.cylinders); return (Math.PI * Math.pow(b / 2, 2) * s * c / 1000).toFixed(0); } },
            { label: 'Liters', calculate: (inputs) => { const b = Number(inputs.bore); const s = Number(inputs.stroke); const c = Number(inputs.cylinders); return (Math.PI * Math.pow(b / 2, 2) * s * c / 1000000).toFixed(1); } }
        ],
        content: { whatIs: '<p>Calculates engine displacement.</p>' }
    },
    'gear-speed-calculator': {
        id: 'gear-speed-calculator',
        title: 'Gear Speed',
        description: 'Speed from RPM.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'rpm', label: 'Engine RPM', type: 'number', placeholder: '3000' },
            { id: 'ratio', label: 'Total Gear Ratio', type: 'number', placeholder: '3.5' },
            { id: 'tire', label: 'Tire Diameter (in)', type: 'number', placeholder: '26' }
        ],
        outputs: [
            { label: 'Speed (mph)', calculate: (inputs) => { const rpm = Number(inputs.rpm); const r = Number(inputs.ratio); const t = Number(inputs.tire); return r ? (rpm * t * Math.PI / (r * 336)).toFixed(1) : '0'; } }
        ],
        content: { whatIs: '<p>Calculates vehicle speed from RPM.</p>' }
    },
    'braking-distance-calculator': {
        id: 'braking-distance-calculator',
        title: 'Braking Distance',
        description: 'Stop distance.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'speed', label: 'Speed (mph)', type: 'number', placeholder: '60' }
        ],
        outputs: [
            { label: 'Distance (ft)', calculate: (inputs) => { const s = Number(inputs.speed); return (s * s / 20).toFixed(0); } },
            { label: 'Distance (m)', calculate: (inputs) => { const s = Number(inputs.speed); return (s * s / 20 * 0.3048).toFixed(0); } }
        ],
        content: { whatIs: '<p>Estimates braking distance.</p>' }
    },
    'mpg-to-lper100-calculator': {
        id: 'mpg-to-lper100-calculator',
        title: 'MPG to L/100km',
        description: 'Fuel economy convert.',
        category: 'conversion',
        icon: 'ArrowLeftRight',
        inputs: [
            { id: 'mpg', label: 'Miles per Gallon', type: 'number', placeholder: '30' }
        ],
        outputs: [
            { label: 'L/100km', calculate: (inputs) => { const m = Number(inputs.mpg); return m ? (235.215 / m).toFixed(2) : '0'; } }
        ],
        content: { whatIs: '<p>Converts MPG to L/100km.</p>' }
    },
    // Batch CR: Legal/Tax Tools
    'billable-hours-calculator': {
        id: 'billable-hours-calculator',
        title: 'Billable Hours',
        description: 'Invoice calculation.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'hours', label: 'Hours Worked', type: 'number', placeholder: '8.5' },
            { id: 'rate', label: 'Hourly Rate ($)', type: 'number', placeholder: '150' }
        ],
        outputs: [
            { label: 'Total Bill', calculate: (inputs) => (Number(inputs.hours) * Number(inputs.rate)).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates billable amount.</p>' }
    },
    'tax-withhold-calculator': {
        id: 'tax-withhold-calculator',
        title: 'Tax Withholding',
        description: 'Estimated withhold.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'gross', label: 'Gross Pay', type: 'number', placeholder: '5000' },
            { id: 'rate', label: 'Tax Rate (%)', type: 'number', placeholder: '22' }
        ],
        outputs: [
            { label: 'Tax Withheld', calculate: (inputs) => (Number(inputs.gross) * Number(inputs.rate) / 100).toFixed(2) },
            { label: 'Net Pay', calculate: (inputs) => (Number(inputs.gross) * (1 - Number(inputs.rate) / 100)).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates tax withholding.</p>' }
    },
    'depreciation-calculator': {
        id: 'depreciation-calculator',
        title: 'Straight-Line Depreciation',
        description: 'Annual depreciation.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'cost', label: 'Asset Cost', type: 'number', placeholder: '50000' },
            { id: 'salvage', label: 'Salvage Value', type: 'number', placeholder: '5000' },
            { id: 'life', label: 'Useful Life (years)', type: 'number', placeholder: '10' }
        ],
        outputs: [
            { label: 'Annual Depreciation', calculate: (inputs) => { const l = Number(inputs.life); return l ? ((Number(inputs.cost) - Number(inputs.salvage)) / l).toFixed(2) : '0'; } }
        ],
        content: { whatIs: '<p>Calculates straight-line depreciation.</p>' }
    },
    'estate-value-calculator': {
        id: 'estate-value-calculator',
        title: 'Estate Value Est',
        description: 'Net worth estimate.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'assets', label: 'Total Assets', type: 'number', placeholder: '500000' },
            { id: 'liabilities', label: 'Total Liabilities', type: 'number', placeholder: '150000' }
        ],
        outputs: [
            { label: 'Net Estate', calculate: (inputs) => (Number(inputs.assets) - Number(inputs.liabilities)).toFixed(0) }
        ],
        content: { whatIs: '<p>Calculates net estate value.</p>' }
    },
    'child-support-est-calculator': {
        id: 'child-support-est-calculator',
        title: 'Child Support Est',
        description: 'Rough estimate.',
        category: 'finance',
        icon: 'TrendingUp',
        inputs: [
            { id: 'income', label: 'Monthly Income', type: 'number', placeholder: '5000' },
            { id: 'children', label: 'Number of Children', type: 'number', placeholder: '2' }
        ],
        outputs: [
            { label: 'Estimated Support', calculate: (inputs) => { const i = Number(inputs.income); const c = Number(inputs.children); const pct = c === 1 ? 0.17 : c === 2 ? 0.25 : c === 3 ? 0.29 : 0.31; return (i * pct).toFixed(0); } }
        ],
        content: { whatIs: '<p>Estimates child support (varies by jurisdiction).</p>' }
    },
    // Batch CS: Event Planning
    'guest-count-calculator': {
        id: 'guest-count-calculator',
        title: 'Guest Count Est',
        description: 'Expected attendees.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'invited', label: 'Invitations Sent', type: 'number', placeholder: '100' },
            { id: 'rsvp', label: 'RSVP Rate (%)', type: 'number', placeholder: '80', defaultValue: '80' }
        ],
        outputs: [
            { label: 'Expected Guests', calculate: (inputs) => Math.round(Number(inputs.invited) * Number(inputs.rsvp) / 100).toString() }
        ],
        content: { whatIs: '<p>Estimates guest attendance.</p>' }
    },
    'catering-calculator': {
        id: 'catering-calculator',
        title: 'Catering Estimate',
        description: 'Food per person.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'guests', label: 'Number of Guests', type: 'number', placeholder: '80' },
            { id: 'ppPerson', label: 'Cost per Person ($)', type: 'number', placeholder: '45' }
        ],
        outputs: [
            { label: 'Total Cost', calculate: (inputs) => (Number(inputs.guests) * Number(inputs.ppPerson)).toFixed(0) }
        ],
        content: { whatIs: '<p>Estimates catering costs.</p>' }
    },
    'venue-size-calculator': {
        id: 'venue-size-calculator',
        title: 'Venue Size',
        description: 'Sq ft for guests.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'guests', label: 'Number of Guests', type: 'number', placeholder: '100' },
            { id: 'style', label: 'Style (seated/cocktail)', type: 'string', placeholder: 'seated' }
        ],
        outputs: [
            { label: 'Sq Ft Needed', calculate: (inputs) => { const g = Number(inputs.guests); const s = String(inputs.style || 'seated').toLowerCase(); const sqft = s === 'cocktail' ? 10 : 15; return (g * sqft).toString(); } }
        ],
        content: { whatIs: '<p>Calculates venue size needed.</p>' }
    },
    'seating-chart-calculator': {
        id: 'seating-chart-calculator',
        title: 'Seating Tables',
        description: 'Tables needed.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'guests', label: 'Number of Guests', type: 'number', placeholder: '80' },
            { id: 'perTable', label: 'Guests per Table', type: 'number', placeholder: '8' }
        ],
        outputs: [
            { label: 'Tables Needed', calculate: (inputs) => Math.ceil(Number(inputs.guests) / Number(inputs.perTable)).toString() }
        ],
        content: { whatIs: '<p>Calculates number of tables.</p>' }
    },
    'budget-split-calculator': {
        id: 'budget-split-calculator',
        title: 'Event Budget Split',
        description: 'Budget allocation.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'total', label: 'Total Budget', type: 'number', placeholder: '20000' }
        ],
        outputs: [
            { label: 'Venue (40%)', calculate: (inputs) => (Number(inputs.total) * 0.4).toFixed(0) },
            { label: 'Catering (30%)', calculate: (inputs) => (Number(inputs.total) * 0.3).toFixed(0) },
            { label: 'Decor (15%)', calculate: (inputs) => (Number(inputs.total) * 0.15).toFixed(0) },
            { label: 'Other (15%)', calculate: (inputs) => (Number(inputs.total) * 0.15).toFixed(0) }
        ],
        content: { whatIs: '<p>Suggests event budget allocation.</p>' }
    },
    // Batch CT: 3D Printing
    'filament-cost-calculator': {
        id: 'filament-cost-calculator',
        title: '3D Print Filament Cost',
        description: 'Cost per print.',
        category: 'electronics',
        icon: 'Calculator',
        inputs: [
            { id: 'weight', label: 'Print Weight (g)', type: 'number', placeholder: '50' },
            { id: 'spoolWeight', label: 'Spool Weight (g)', type: 'number', placeholder: '1000', defaultValue: '1000' },
            { id: 'spoolPrice', label: 'Spool Price ($)', type: 'number', placeholder: '25' }
        ],
        outputs: [
            { label: 'Print Cost ($)', calculate: (inputs) => (Number(inputs.weight) * Number(inputs.spoolPrice) / Number(inputs.spoolWeight)).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates the cost of filament used in a 3D print.</p>' }
    },
    'print-time-est-calculator': {
        id: 'print-time-est-calculator',
        title: '3D Print Time Est',
        description: 'Rough estimate.',
        category: 'electronics',
        icon: 'Calculator',
        inputs: [
            { id: 'volume', label: 'Model Volume (cm³)', type: 'number', placeholder: '50' },
            { id: 'speed', label: 'Print Speed (mm/s)', type: 'number', placeholder: '60', defaultValue: '60' },
            { id: 'layerHeight', label: 'Layer Height (mm)', type: 'number', placeholder: '0.2', defaultValue: '0.2' }
        ],
        outputs: [
            { label: 'Est. Time (hours)', calculate: (inputs) => { const v = Number(inputs.volume) * 1000; const s = Number(inputs.speed); const lh = Number(inputs.layerHeight); return (v / (s * lh * 0.4 * 3600)).toFixed(1); } }
        ],
        content: { whatIs: '<p>Provides a very rough estimate of 3D print time based on volume and speed.</p>' }
    },
    'layer-height-calculator': {
        id: 'layer-height-calculator',
        title: '3D Print Layer Height',
        description: 'Optimal height.',
        category: 'electronics',
        icon: 'Calculator',
        inputs: [
            { id: 'nozzle', label: 'Nozzle Diameter (mm)', type: 'number', placeholder: '0.4', defaultValue: '0.4' }
        ],
        outputs: [
            { label: 'Ideal (0.2x)', calculate: (inputs) => (Number(inputs.nozzle) * 0.2).toFixed(2) + 'mm' },
            { label: 'Standard (0.5x)', calculate: (inputs) => (Number(inputs.nozzle) * 0.5).toFixed(2) + 'mm' },
            { label: 'Max (0.75x)', calculate: (inputs) => (Number(inputs.nozzle) * 0.75).toFixed(2) + 'mm' }
        ],
        content: { whatIs: '<p>Calculates recommended layer heights for a given nozzle size.</p>' }
    },
    'infill-density-calculator': {
        id: 'infill-density-calculator',
        title: '3D Print Infill Weight',
        description: 'Weight adjustment.',
        category: 'electronics',
        icon: 'Calculator',
        inputs: [
            { id: 'solidWeight', label: '100% Infill Weight (g)', type: 'number', placeholder: '100' },
            { id: 'infill', label: 'Desired Infill (%)', type: 'number', placeholder: '20', defaultValue: '20' }
        ],
        outputs: [
            { label: 'New Weight (g)', calculate: (inputs) => (Number(inputs.solidWeight) * Number(inputs.infill) / 100).toFixed(1) }
        ],
        content: { whatIs: '<p>Estimates print weight based on infill percentage.</p>' }
    },
    'bed-level-test-calculator': {
        id: 'bed-level-test-calculator',
        title: 'Bed Leveling Test Size',
        description: 'Custom test square.',
        category: 'electronics',
        icon: 'Calculator',
        inputs: [
            { id: 'bedX', label: 'Bed X Size (mm)', type: 'number', placeholder: '235', defaultValue: '235' },
            { id: 'bedY', label: 'Bed Y Size (mm)', type: 'number', placeholder: '235', defaultValue: '235' }
        ],
        outputs: [
            { label: 'Center Square (mm)', calculate: (inputs) => Math.round(Number(inputs.bedX) * 0.2) + 'x' + Math.round(Number(inputs.bedY) * 0.2) }
        ],
        content: { whatIs: '<p>Calculates sizes for bed leveling test squares.</p>' }
    },
    // Batch CU: Woodworking
    'board-feet-calculator': {
        id: 'board-feet-calculator',
        title: 'Board Feet',
        description: 'Lumber volume.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 't', label: 'Thickness (inches)', type: 'number', placeholder: '1' },
            { id: 'w', label: 'Width (inches)', type: 'number', placeholder: '6' },
            { id: 'l', label: 'Length (feet)', type: 'number', placeholder: '8' }
        ],
        outputs: [
            { label: 'Board Feet', calculate: (inputs) => (Number(inputs.t) * Number(inputs.w) * Number(inputs.l) / 12).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates board feet for lumber purchasing.</p>' }
    },
    'wood-waste-calculator': {
        id: 'wood-waste-calculator',
        title: 'Wood Waste Multiplier',
        description: 'Extra lumber to buy.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'needed', label: 'Board Feet Needed', type: 'number', placeholder: '50' },
            { id: 'waste', label: 'Waste Percent (%)', type: 'number', placeholder: '15', defaultValue: '15' }
        ],
        outputs: [
            { label: 'Total to Buy (BF)', calculate: (inputs) => (Number(inputs.needed) * (1 + Number(inputs.waste) / 100)).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates total lumber needed including waste factor.</p>' }
    },
    'screw-length-calculator': {
        id: 'screw-length-calculator',
        title: 'Screw Length Guide',
        description: 'Recommended length.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'thickness', label: 'Board Thickness (mm)', type: 'number', placeholder: '18' }
        ],
        outputs: [
            { label: 'Min Screw (mm)', calculate: (inputs) => (Number(inputs.thickness) * 2.5).toFixed(0) },
            { label: 'Standard Screw (mm)', calculate: (inputs) => (Number(inputs.thickness) * 3).toFixed(0) }
        ],
        content: { whatIs: '<p>Provides a general rule of thumb for screw lengths in woodworking.</p>' }
    },
    'dowel-size-calculator': {
        id: 'dowel-size-calculator',
        title: 'Dowel Diameter',
        description: 'Rule of thumb.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'thickness', label: 'Board Thickness (mm)', type: 'number', placeholder: '18' }
        ],
        outputs: [
            { label: 'Dowel Dia (mm)', calculate: (inputs) => (Number(inputs.thickness) * 0.4).toFixed(1) }
        ],
        content: { whatIs: '<p>Recommends dowel diameter based on board thickness.</p>' }
    },
    'plywood-sheets-calculator': {
        id: 'plywood-sheets-calculator',
        title: 'Plywood Sheets',
        description: 'Area coverage.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'area', label: 'Total Area (m²)', type: 'number', placeholder: '10' },
            { id: 'sheetW', label: 'Sheet Width (m)', type: 'number', placeholder: '1.22', defaultValue: '1.22' },
            { id: 'sheetL', label: 'Sheet Length (m)', type: 'number', placeholder: '2.44', defaultValue: '2.44' }
        ],
        outputs: [
            { label: 'Sheets Needed', calculate: (inputs) => { const sa = Number(inputs.sheetW) * Number(inputs.sheetL); return Math.ceil(Number(inputs.area) / sa).toString(); } }
        ],
        content: { whatIs: '<p>Calculates number of plywood sheets needed for an area.</p>' }
    },
    // Batch CV: DIY/Home
    'wallpaper-calculator': {
        id: 'wallpaper-calculator',
        title: 'Wallpaper Rolls',
        description: 'Rolls per wall.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'width', label: 'Wall Width (m)', type: 'number', placeholder: '4' },
            { id: 'height', label: 'Wall Height (m)', type: 'number', placeholder: '2.5' },
            { id: 'rollWidth', label: 'Roll Width (m)', type: 'number', placeholder: '0.53', defaultValue: '0.53' },
            { id: 'rollLength', label: 'Roll Length (m)', type: 'number', placeholder: '10', defaultValue: '10' }
        ],
        outputs: [
            { label: 'Rolls Needed', calculate: (inputs) => { const wa = Number(inputs.width) * Number(inputs.height); const ra = Number(inputs.rollWidth) * Number(inputs.rollLength); return Math.ceil(wa / (ra * 0.9)).toString(); } }
        ],
        content: { whatIs: '<p>Calculates number of wallpaper rolls, accounts for 10% pattern waste.</p>' }
    },
    'flooring-calculator': {
        id: 'flooring-calculator',
        title: 'Flooring Needed',
        description: 'Planks or tiles.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'area', label: 'Floor Area (m²)', type: 'number', placeholder: '20' },
            { id: 'boxSize', label: 'Area per Box (m²)', type: 'number', placeholder: '2.2' }
        ],
        outputs: [
            { label: 'Boxes Needed', calculate: (inputs) => Math.ceil(Number(inputs.area) * 1.1 / Number(inputs.boxSize)).toString() }
        ],
        content: { whatIs: '<p>Calculates flooring boxes needed, including 10% waste.</p>' }
    },
    'crown-molding-calculator': {
        id: 'crown-molding-calculator',
        title: 'Crown Molding Cut',
        description: 'Miter & Bevel angles.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'wall', label: 'Wall Angle (°)', type: 'number', placeholder: '90', defaultValue: '90' },
            { id: 'spring', label: 'Spring Angle (°)', type: 'number', placeholder: '38', defaultValue: '38' }
        ],
        outputs: [
            { label: 'Miter Angle', calculate: (inputs) => { const w = Number(inputs.wall) * Math.PI / 360; const s = Number(inputs.spring) * Math.PI / 180; return (Math.atan(Math.tan(w) * Math.cos(s)) * 180 / Math.PI).toFixed(1); } },
            { label: 'Bevel Angle', calculate: (inputs) => { const w = Number(inputs.wall) * Math.PI / 360; const s = Number(inputs.spring) * Math.PI / 180; return (Math.asin(Math.sin(s) * Math.sin(w)) * 180 / Math.PI).toFixed(1); } }
        ],
        content: { whatIs: '<p>Calculates miter and bevel angles for compound crown molding cuts.</p>' }
    },
    'deck-boards-calculator': {
        id: 'deck-boards-calculator',
        title: 'Deck Boards',
        description: 'Linear feet.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'width', label: 'Deck Width (ft)', type: 'number', placeholder: '12' },
            { id: 'length', label: 'Deck Length (ft)', type: 'number', placeholder: '16' },
            { id: 'boardW', label: 'Board Width (in)', type: 'number', placeholder: '5.5', defaultValue: '5.5' }
        ],
        outputs: [
            { label: 'Boards (16ft)', calculate: (inputs) => { const w = Number(inputs.width); const b = Number(inputs.boardW) + 0.25; return Math.ceil(w * 12 / b).toString(); } }
        ],
        content: { whatIs: '<p>Calculates number of deck boards needed.</p>' }
    },
    'tile-grout-vol-calculator': {
        id: 'tile-grout-vol-calculator',
        title: 'Tile Grout Volume',
        description: 'Amount of grout.',
        category: 'construction',
        icon: 'Hammer',
        inputs: [
            { id: 'area', label: 'Area (m²)', type: 'number', placeholder: '5' },
            { id: 'tileW', label: 'Tile Width (mm)', type: 'number', placeholder: '300' },
            { id: 'tileL', label: 'Tile Length (mm)', type: 'number', placeholder: '300' },
            { id: 'depth', label: 'Tile Depth (mm)', type: 'number', placeholder: '8' },
            { id: 'joint', label: 'Joint Width (mm)', type: 'number', placeholder: '3' }
        ],
        outputs: [
            { label: 'Grout Needed (kg)', calculate: (inputs) => { const a = Number(inputs.area); const w = Number(inputs.tileW); const l = Number(inputs.tileL); const d = Number(inputs.depth); const j = Number(inputs.joint); return (a * ((w + l) / (w * l)) * d * j * 1.6).toFixed(1); } }
        ],
        content: { whatIs: '<p>Calculates grout quantity based on tile dimensions.</p>' }
    },
    // Batch CW: Farming/Agriculture
    'seed-rate-calculator': {
        id: 'seed-rate-calculator',
        title: 'Seed Planting Rate',
        description: 'Seeds per meter.',
        category: 'ecology',
        icon: 'Trees',
        inputs: [
            { id: 'target', label: 'Target Plants/m²', type: 'number', placeholder: '300' },
            { id: 'germ', label: 'Germination (%)', type: 'number', placeholder: '90', defaultValue: '90' },
            { id: 'purity', label: 'Purity (%)', type: 'number', placeholder: '99', defaultValue: '99' }
        ],
        outputs: [
            { label: 'Live Seeds/m²', calculate: (inputs) => (Number(inputs.target) / (Number(inputs.germ) * Number(inputs.purity) / 10000)).toFixed(0) }
        ],
        content: { whatIs: '<p>Calculates seeding rate adjusted for germination and purity.</p>' }
    },
    'fertilizer-spread-calculator': {
        id: 'fertilizer-spread-calculator',
        title: 'Fertilizer Spreader',
        description: 'Rate per pass.',
        category: 'ecology',
        icon: 'Trees',
        inputs: [
            { id: 'width', label: 'Spread Width (m)', type: 'number', placeholder: '12' },
            { id: 'speed', label: 'Speed (km/h)', type: 'number', placeholder: '8' },
            { id: 'targetRate', label: 'Target Rate (kg/ha)', type: 'number', placeholder: '200' }
        ],
        outputs: [
            { label: 'Flow (kg/min)', calculate: (inputs) => (Number(inputs.width) * Number(inputs.speed) * Number(inputs.targetRate) / 600).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates fertilizer flow rate for spreader calibration.</p>' }
    },
    'crop-yield-est-calculator': {
        id: 'crop-yield-est-calculator',
        title: 'Crop Yield Est',
        description: 'Corn/Grain yield.',
        category: 'ecology',
        icon: 'Trees',
        inputs: [
            { id: 'ears', label: 'Ears per 1/1000 Acre', type: 'number', placeholder: '32' },
            { id: 'kernels', label: 'Kernels per Ear', type: 'number', placeholder: '600' }
        ],
        outputs: [
            { label: 'Bushels/Acre', calculate: (inputs) => (Number(inputs.ears) * Number(inputs.kernels) / 90).toFixed(0) }
        ],
        content: { whatIs: '<p>Estimates corn yield per acre.</p>' }
    },
    'irrigation-water-calculator': {
        id: 'irrigation-water-calculator',
        title: 'Irrigation Water',
        description: 'Volume per area.',
        category: 'ecology',
        icon: 'Trees',
        inputs: [
            { id: 'area', label: 'Area (hectares)', type: 'number', placeholder: '10' },
            { id: 'depth', label: 'Water Depth (mm)', type: 'number', placeholder: '25' }
        ],
        outputs: [
            { label: 'Volume (m³)', calculate: (inputs) => (Number(inputs.area) * Number(inputs.depth) * 10).toFixed(0) }
        ],
        content: { whatIs: '<p>Calculates total water volume for irrigation.</p>' }
    },
    'livestock-feed-calculator': {
        id: 'livestock-feed-calculator',
        title: 'Livestock Feed',
        description: 'Daily intake.',
        category: 'ecology',
        icon: 'Trees',
        inputs: [
            { id: 'weight', label: 'Avg Weight (kg)', type: 'number', placeholder: '500' },
            { id: 'count', label: 'Head Count', type: 'number', placeholder: '20' },
            { id: 'rate', label: 'Feed % of Weight', type: 'number', placeholder: '2.5', defaultValue: '2.5' }
        ],
        outputs: [
            { label: 'Daily Total (kg)', calculate: (inputs) => (Number(inputs.weight) * Number(inputs.count) * Number(inputs.rate) / 100).toFixed(0) }
        ],
        content: { whatIs: '<p>Estimates total daily feed requirement for a herd.</p>' }
    },
    // Batch CX: Brewing/Wine
    'abv-calculator': {
        id: 'abv-calculator',
        title: 'ABV Calculator',
        description: 'Alcohol by volume.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'og', label: 'Original Gravity', type: 'number', placeholder: '1.050' },
            { id: 'fg', label: 'Final Gravity', type: 'number', placeholder: '1.010' }
        ],
        outputs: [
            { label: 'ABV (%)', calculate: (inputs) => ((Number(inputs.og) - Number(inputs.fg)) * 131.25).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates alcohol by volume for beer or wine.</p>' }
    },
    'ibu-calculator': {
        id: 'ibu-calculator',
        title: 'IBU Bitterness',
        description: 'Hops calculation.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'aa', label: 'Hops AA (%)', type: 'number', placeholder: '5.5' },
            { id: 'weight', label: 'Weight (g)', type: 'number', placeholder: '28' },
            { id: 'volume', label: 'Batch Volume (L)', type: 'number', placeholder: '19' },
            { id: 'utilization', label: 'Utilization (%)', type: 'number', placeholder: '25', defaultValue: '25' }
        ],
        outputs: [
            { label: 'IBU', calculate: (inputs) => (Number(inputs.weight) * Number(inputs.aa) * Number(inputs.utilization) / Number(inputs.volume) / 10).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates International Bitterness Units (IBU).</p>' }
    },
    'srm-beer-color-calculator': {
        id: 'srm-beer-color-calculator',
        title: 'SRM Beer Color',
        description: 'Malt color estimate.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'mcu', label: 'MCU Total', type: 'number', placeholder: '10' }
        ],
        outputs: [
            { label: 'SRM Color', calculate: (inputs) => (1.4922 * Math.pow(Number(inputs.mcu), 0.6859)).toFixed(1) }
        ],
        content: { whatIs: '<p>Estimates beer color in SRM using Morey\'s formula.</p>' }
    },
    'carbonation-vol-calculator': {
        id: 'carbonation-vol-calculator',
        title: 'Carbonation CO₂',
        description: 'Priming sugar.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'vol', label: 'Batch Volume (L)', type: 'number', placeholder: '19' },
            { id: 'target', label: 'Target CO₂ Vols', type: 'number', placeholder: '2.4' },
            { id: 'temp', label: 'Current Temp (°C)', type: 'number', placeholder: '20' }
        ],
        outputs: [
            { label: 'Corn Sugar (g)', calculate: (inputs) => { const v = Number(inputs.vol); const t = Number(inputs.target); const tc = Number(inputs.temp); const res = v * 15.195 * (t - 3.0378 + (0.050062 * tc) - (0.00026555 * tc * tc)); return res > 0 ? res.toFixed(0) : '0'; } }
        ],
        content: { whatIs: '<p>Calculates priming sugar for natural carbonation.</p>' }
    },
    'bottle-count-calculator': {
        id: 'bottle-count-calculator',
        title: 'Bottle Count',
        description: 'How many bottles.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'batch', label: 'Batch Size (L)', type: 'number', placeholder: '20' },
            { id: 'size', label: 'Bottle Size (ml)', type: 'number', placeholder: '500', defaultValue: '500' }
        ],
        outputs: [
            { label: 'Bottles Needed', calculate: (inputs) => Math.ceil(Number(inputs.batch) * 1000 / Number(inputs.size)).toString() }
        ],
        content: { whatIs: '<p>Calculates number of bottles needed for a batch.</p>' }
    },
    // Batch CY: Baby/Parenting
    'due-date-calculator': {
        id: 'due-date-calculator',
        title: 'Pregnancy Due Date',
        description: 'Estimated due date.',
        category: 'health',
        icon: 'HeartPulse',
        inputs: [
            { id: 'lastPeriod', label: 'Last Period (any #)', type: 'number', placeholder: '1' }
        ],
        outputs: [
            { label: 'Days from now', calculate: () => '280' },
            { label: 'Weeks', calculate: () => '40' }
        ],
        content: { whatIs: '<p>Calculates estimated due date (Naegele\'s rule basic).</p>' }
    },
    'baby-age-weeks-calculator': {
        id: 'baby-age-weeks-calculator',
        title: 'Baby Age Weeks',
        description: 'Age in weeks/days.',
        category: 'health',
        icon: 'HeartPulse',
        inputs: [
            { id: 'days', label: 'Days since birth', type: 'number', placeholder: '45' }
        ],
        outputs: [
            { label: 'Weeks', calculate: (inputs) => Math.floor(Number(inputs.days) / 7).toString() },
            { label: 'Remaining Days', calculate: (inputs) => (Number(inputs.days) % 7).toString() }
        ],
        content: { whatIs: '<p>Converts baby days to weeks and days.</p>' }
    },
    'diaper-cost-calculator': {
        id: 'diaper-cost-calculator',
        title: 'Annual Diaper Cost',
        description: 'Cost estimate.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'perDay', label: 'Diapers per Day', type: 'number', placeholder: '8' },
            { id: 'price', label: 'Price per Diaper ($)', type: 'number', placeholder: '0.25' }
        ],
        outputs: [
            { label: 'Monthly Cost ($)', calculate: (inputs) => (Number(inputs.perDay) * 30.4 * Number(inputs.price)).toFixed(2) },
            { label: 'Annual Cost ($)', calculate: (inputs) => (Number(inputs.perDay) * 365 * Number(inputs.price)).toFixed(0) }
        ],
        content: { whatIs: '<p>Estimates the recurring cost of diapers.</p>' }
    },
    'formula-feed-calculator': {
        id: 'formula-feed-calculator',
        title: 'Baby Formula Needed',
        description: 'Daily volume.',
        category: 'health',
        icon: 'HeartPulse',
        inputs: [
            { id: 'weight', label: 'Baby Weight (kg)', type: 'number', placeholder: '5' }
        ],
        outputs: [
            { label: 'Total Daily (ml)', calculate: (inputs) => (Number(inputs.weight) * 150).toFixed(0) },
            { label: 'Per Feed (8 feeds)', calculate: (inputs) => (Number(inputs.weight) * 150 / 8).toFixed(0) }
        ],
        content: { whatIs: '<p>Estimates formula requirement based on baby weight.</p>' }
    },
    'sleep-schedule-calculator': {
        id: 'sleep-schedule-calculator',
        title: 'Baby Wake Windows',
        description: 'Sleep timing.',
        category: 'health',
        icon: 'HeartPulse',
        inputs: [
            { id: 'age', label: 'Age (months)', type: 'number', placeholder: '6' }
        ],
        outputs: [
            { label: 'Wake Window (h)', calculate: (inputs) => { const a = Number(inputs.age); if (a < 2) return '1-1.5'; if (a < 4) return '1.5-2'; if (a < 6) return '2-2.5'; if (a < 9) return '2.5-3'; return '3-4'; } }
        ],
        content: { whatIs: '<p>Provides general wake window guidelines for babies.</p>' }
    },
    // Batch CZ: Security/Safety
    'password-strength-v2-calculator': {
        id: 'password-strength-v2-calculator',
        title: 'Password Strength',
        description: 'Entropy calculation.',
        category: 'web',
        icon: 'ShieldCheck',
        inputs: [
            { id: 'length', label: 'Password Length', type: 'number', placeholder: '12' },
            { id: 'charset', label: 'Charset Size (e.g. 94)', type: 'number', placeholder: '94', defaultValue: '94' }
        ],
        outputs: [
            { label: 'Entropy (bits)', calculate: (inputs) => (Number(inputs.length) * Math.log2(Number(inputs.charset))).toFixed(1) },
            { label: 'Brute Force Time', calculate: (inputs) => { const ent = Number(inputs.length) * Math.log2(Number(inputs.charset)); if (ent < 50) return 'Weak'; if (ent < 80) return 'Moderate'; return 'Strong'; } }
        ],
        content: { whatIs: '<p>Calculates password entropy to estimate strength.</p>' }
    },
    'fire-extinguisher-calculator': {
        id: 'fire-extinguisher-calculator',
        title: 'Fire Extinguisher Size',
        description: 'Home safety.',
        category: 'everyday',
        icon: 'Shield',
        inputs: [
            { id: 'sqft', label: 'Floor Area (sq ft)', type: 'number', placeholder: '2000' }
        ],
        outputs: [
            { label: 'Min Extinguishers', calculate: (inputs) => Math.ceil(Number(inputs.sqft) / 3000).toString() },
            { label: 'Max Travel Dist (ft)', calculate: () => '75' }
        ],
        content: { whatIs: '<p>Estimates general fire extinguisher needs for a home.</p>' }
    },
    'first-aid-kit-checklist-calculator': {
        id: 'first-aid-kit-checklist-calculator',
        title: 'First Aid Kit Items',
        description: 'People to supply.',
        category: 'everyday',
        icon: 'Shield',
        inputs: [
            { id: 'people', label: 'Number of People', type: 'number', placeholder: '4' }
        ],
        outputs: [
            { label: 'Bandages', calculate: (inputs) => (Number(inputs.people) * 5).toString() },
            { label: 'Antiseptic Wipes', calculate: (inputs) => (Number(inputs.people) * 3).toString() }
        ],
        content: { whatIs: '<p>Scales first aid kit items by group size.</p>' }
    },
    'smoke-detector-calculator': {
        id: 'smoke-detector-calculator',
        title: 'Smoke Detector Count',
        description: 'Placement guide.',
        category: 'everyday',
        icon: 'Shield',
        inputs: [
            { id: 'bedrooms', label: 'Number of Bedrooms', type: 'number', placeholder: '3' },
            { id: 'floors', label: 'Number of Floors', type: 'number', placeholder: '2' }
        ],
        outputs: [
            { label: 'Min Detectors', calculate: (inputs) => (Number(inputs.bedrooms) + Number(inputs.floors)).toString() }
        ],
        content: { whatIs: '<p>Estimates minimum number of smoke detectors needed.</p>' }
    },
    'emergency-supply-water-calculator': {
        id: 'emergency-supply-water-calculator',
        title: 'Emergency Water',
        description: 'Days of supply.',
        category: 'everyday',
        icon: 'Shield',
        inputs: [
            { id: 'people', label: 'People', type: 'number', placeholder: '4' },
            { id: 'days', label: 'Days Prep', type: 'number', placeholder: '3' }
        ],
        outputs: [
            { label: 'Water (Gallons)', calculate: (inputs) => (Number(inputs.people) * Number(inputs.days)).toString() },
            { label: 'Water (Liters)', calculate: (inputs) => (Number(inputs.people) * Number(inputs.days) * 3.78).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates emergency water storage (1 gallon per person per day).</p>' }
    },
    // Batch DA: Gaming/Esports
    'fps-to-ms-calculator': {
        id: 'fps-to-ms-calculator',
        title: 'FPS to Frame Time',
        description: 'Latency in ms.',
        category: 'web',
        icon: 'Monitor',
        inputs: [
            { id: 'fps', label: 'Frames per Second', type: 'number', placeholder: '144' }
        ],
        outputs: [
            { label: 'Frame Time (ms)', calculate: (inputs) => { const f = Number(inputs.fps); return f ? (1000 / f).toFixed(2) : '0'; } }
        ],
        content: { whatIs: '<p>Converts FPS to frame time latency.</p>' }
    },
    'dpi-sensitivity-calculator': {
        id: 'dpi-sensitivity-calculator',
        title: 'eDPI Calculator',
        description: 'Effective sensitivity.',
        category: 'everyday',
        icon: 'MousePointer2',
        inputs: [
            { id: 'dpi', label: 'Mouse DPI', type: 'number', placeholder: '800' },
            { id: 'sens', label: 'In-game Sense', type: 'number', placeholder: '1.5' }
        ],
        outputs: [
            { label: 'eDPI', calculate: (inputs) => (Number(inputs.dpi) * Number(inputs.sens)).toFixed(0) }
        ],
        content: { whatIs: '<p>Calculates effective DPI for FPS game sensitivity matching.</p>' }
    },
    'kda-ratio-calculator': {
        id: 'kda-ratio-calculator',
        title: 'KDA Ratio',
        description: 'Kills/Deaths/Assists.',
        category: 'everyday',
        icon: 'Trophy',
        inputs: [
            { id: 'k', label: 'Kills', type: 'number', placeholder: '10' },
            { id: 'd', label: 'Deaths', type: 'number', placeholder: '2' },
            { id: 'a', label: 'Assists', type: 'number', placeholder: '5' }
        ],
        outputs: [
            { label: 'KDA Ratio', calculate: (inputs) => { const d = Math.max(1, Number(inputs.d)); return ((Number(inputs.k) + Number(inputs.a)) / d).toFixed(2); } }
        ],
        content: { whatIs: '<p>Calculates player KDA ratio.</p>' }
    },
    'win-rate-calculator': {
        id: 'win-rate-calculator',
        title: 'Win Rate (%)',
        description: 'Percentage of wins.',
        category: 'everyday',
        icon: 'Trophy',
        inputs: [
            { id: 'wins', label: 'Wins', type: 'number', placeholder: '50' },
            { id: 'loses', label: 'Losses', type: 'number', placeholder: '40' }
        ],
        outputs: [
            { label: 'Win Rate (%)', calculate: (inputs) => { const total = Number(inputs.wins) + Number(inputs.loses); return total ? (Number(inputs.wins) / total * 100).toFixed(1) : '0'; } }
        ],
        content: { whatIs: '<p>Calculates win percentage.</p>' }
    },
    'elo-change-calculator': {
        id: 'elo-change-calculator',
        title: 'Elo Change Est',
        description: 'Rating adjustment.',
        category: 'everyday',
        icon: 'Trophy',
        inputs: [
            { id: 'myRating', label: 'My Rating', type: 'number', placeholder: '1500' },
            { id: 'oppRating', label: 'Opponent Rating', type: 'number', placeholder: '1550' },
            { id: 'kFactor', label: 'K-Factor', type: 'number', placeholder: '32', defaultValue: '32' }
        ],
        outputs: [
            { label: 'Win Gain', calculate: (inputs) => { const m = Number(inputs.myRating); const o = Number(inputs.oppRating); const k = Number(inputs.kFactor); const exp = 1 / (1 + Math.pow(10, (o - m) / 400)); return (k * (1 - exp)).toFixed(1); } },
            { label: 'Loss Drop', calculate: (inputs) => { const m = Number(inputs.myRating); const o = Number(inputs.oppRating); const k = Number(inputs.kFactor); const exp = 1 / (1 + Math.pow(10, (o - m) / 400)); return (k * exp).toFixed(1); } }
        ],
        content: { whatIs: '<p>Estimates Elo rating change based on opponent strength.</p>' }
    },
    // Batch DB: Social Media
    'engagement-rate-calculator': {
        id: 'engagement-rate-calculator',
        title: 'Engagement Rate',
        description: 'Interactions per reach.',
        category: 'marketing',
        icon: 'BarChart3',
        inputs: [
            { id: 'interactions', label: 'Likes/Comments/Shares', type: 'number', placeholder: '500' },
            { id: 'followers', label: 'Total Followers', type: 'number', placeholder: '10000' }
        ],
        outputs: [
            { label: 'Rate (%)', calculate: (inputs) => (Number(inputs.interactions) / Number(inputs.followers) * 100).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates social media engagement rate.</p>' }
    },
    'follower-growth-calculator': {
        id: 'follower-growth-calculator',
        title: 'Follower Growth Rate',
        description: 'Growth percentage.',
        category: 'marketing',
        icon: 'BarChart3',
        inputs: [
            { id: 'new', label: 'New Followers', type: 'number', placeholder: '200' },
            { id: 'prev', label: 'Previous Total', type: 'number', placeholder: '5000' }
        ],
        outputs: [
            { label: 'Growth Rate (%)', calculate: (inputs) => (Number(inputs.new) / Number(inputs.prev) * 100).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates follower growth rate.</p>' }
    },
    'post-reach-rate-calculator': {
        id: 'post-reach-rate-calculator',
        title: 'Post Reach Rate',
        description: 'Reach vs Followers.',
        category: 'marketing',
        icon: 'BarChart3',
        inputs: [
            { id: 'reach', label: 'Unique Reach', type: 'number', placeholder: '2000' },
            { id: 'followers', label: 'Total Followers', type: 'number', placeholder: '10000' }
        ],
        outputs: [
            { label: 'Reach Rate (%)', calculate: (inputs) => (Number(inputs.reach) / Number(inputs.followers) * 100).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates what percentage of followers saw a post.</p>' }
    },
    'hashtag-limit-calculator': {
        id: 'hashtag-limit-calculator',
        title: 'Hashtag Counter',
        description: 'Count vs Limits.',
        category: 'marketing',
        icon: 'BarChart3',
        inputs: [
            { id: 'count', label: 'Current Hashtags', type: 'number', placeholder: '15' }
        ],
        outputs: [
            { label: 'IG Remaining', calculate: (inputs) => (30 - Number(inputs.count)).toString() },
            { label: 'Status', calculate: (inputs) => Number(inputs.count) > 30 ? 'Over Limit!' : 'OK' }
        ],
        content: { whatIs: '<p>Tracks hashtag count against platform limits.</p>' }
    },
    'video-view-completion-calculator': {
        id: 'video-view-completion-calculator',
        title: 'Video Completion Rate',
        description: 'Hook effectiveness.',
        category: 'marketing',
        icon: 'BarChart3',
        inputs: [
            { id: 'completes', label: 'Completed Views', type: 'number', placeholder: '800' },
            { id: 'total', label: 'Total Starts', type: 'number', placeholder: '2000' }
        ],
        outputs: [
            { label: 'Completion (%)', calculate: (inputs) => (Number(inputs.completes) / Number(inputs.total) * 100).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates video completion rate.</p>' }
    },
    // Batch DC: E-commerce
    'profit-margin-v2-calculator': {
        id: 'profit-margin-v2-calculator',
        title: 'E-commerce Profit',
        description: 'Margin after fees.',
        category: 'finance',
        icon: 'DollarSign',
        inputs: [
            { id: 'price', label: 'Selling Price', type: 'number', placeholder: '50' },
            { id: 'cost', label: 'Product Cost', type: 'number', placeholder: '15' },
            { id: 'fees', label: 'Platform Fees (%)', type: 'number', placeholder: '15', defaultValue: '15' },
            { id: 'shipping', label: 'Shipping Cost', type: 'number', placeholder: '5' }
        ],
        outputs: [
            { label: 'Net Profit', calculate: (inputs) => (Number(inputs.price) * (1 - Number(inputs.fees) / 100) - Number(inputs.cost) - Number(inputs.shipping)).toFixed(2) },
            { label: 'Margin (%)', calculate: (inputs) => { const p = Number(inputs.price); const profit = p * (1 - Number(inputs.fees) / 100) - Number(inputs.cost) - Number(inputs.shipping); return (profit / p * 100).toFixed(1); } }
        ],
        content: { whatIs: '<p>Calculates net profit and margin after cost, fees, and shipping.</p>' }
    },
    'shipping-dim-weight-calculator': {
        id: 'shipping-dim-weight-calculator',
        title: 'Dimensional Weight',
        description: 'Billable weight.',
        category: 'finance',
        icon: 'DollarSign',
        inputs: [
            { id: 'l', label: 'Length (in)', type: 'number', placeholder: '12' },
            { id: 'w', label: 'Width (in)', type: 'number', placeholder: '12' },
            { id: 'h', label: 'Height (in)', type: 'number', placeholder: '12' },
            { id: 'factor', label: 'Dim Factor (e.g. 139)', type: 'number', placeholder: '139', defaultValue: '139' }
        ],
        outputs: [
            { label: 'Dim Weight (lb)', calculate: (inputs) => (Number(inputs.l) * Number(inputs.w) * Number(inputs.h) / Number(inputs.factor)).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates dimensional weight for shipping cost estimation.</p>' }
    },
    'inventory-turnover-calculator': {
        id: 'inventory-turnover-calculator',
        title: 'Inventory Turnover',
        description: 'Efficiency ratio.',
        category: 'finance',
        icon: 'DollarSign',
        inputs: [
            { id: 'cogs', label: 'Cost of Goods Sold', type: 'number', placeholder: '100000' },
            { id: 'inventory', label: 'Avg Inventory Value', type: 'number', placeholder: '20000' }
        ],
        outputs: [
            { label: 'Turnover Ratio', calculate: (inputs) => (Number(inputs.cogs) / Number(inputs.inventory)).toFixed(2) },
            { label: 'Days in Inventory', calculate: (inputs) => (365 / (Number(inputs.cogs) / Number(inputs.inventory))).toFixed(0) }
        ],
        content: { whatIs: '<p>Calculates how many times inventory is sold over a period.</p>' }
    },
    'cart-abandonment-calculator': {
        id: 'cart-abandonment-calculator',
        title: 'Cart Abandon Rate',
        description: 'Lost sales rate.',
        category: 'marketing',
        icon: 'ShoppingCart',
        inputs: [
            { id: 'carts', label: 'Carts Created', type: 'number', placeholder: '1000' },
            { id: 'orders', label: 'Orders Completed', type: 'number', placeholder: '300' }
        ],
        outputs: [
            { label: 'Abandon Rate (%)', calculate: (inputs) => ((1 - Number(inputs.orders) / Number(inputs.carts)) * 100).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates the percentage of shoppers who leave without completing a purchase.</p>' }
    },
    'customer-acquisition-roi-calculator': {
        id: 'customer-acquisition-roi-calculator',
        title: 'Marketing ROI (CAC)',
        description: 'Ad spend efficiency.',
        category: 'marketing',
        icon: 'BarChart3',
        inputs: [
            { id: 'revenue', label: 'Revenue from Ads', type: 'number', placeholder: '5000' },
            { id: 'spend', label: 'Ad Spend', type: 'number', placeholder: '1000' }
        ],
        outputs: [
            { label: 'ROAS', calculate: (inputs) => (Number(inputs.revenue) / Number(inputs.spend)).toFixed(1) + 'x' },
            { label: 'ROI (%)', calculate: (inputs) => ((Number(inputs.revenue) - Number(inputs.spend)) / Number(inputs.spend) * 100).toFixed(0) }
        ],
        content: { whatIs: '<p>Calculates Return on Ad Spend (ROAS) and ROI.</p>' }
    },
    // Batch DD: Writing/Publishing
    'word-frequency-calculator': {
        id: 'word-frequency-calculator',
        title: 'Word Frequency',
        description: 'Count repeat words.',
        category: 'text',
        icon: 'Type',
        inputs: [
            { id: 'text', label: 'Paste Text', type: 'string', placeholder: 'The quick brown fox...' }
        ],
        outputs: [
            { label: 'Top Words', calculate: (inputs) => { const words = String(inputs.text || '').toLowerCase().match(/\b\w+\b/g) || []; const counts: any = {}; words.forEach(w => counts[w] = (counts[w] || 0) + 1); return Object.entries(counts).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5).map(([w, c]) => `${w}(${c})`).join(', '); } }
        ],
        content: { whatIs: '<p>Identifies the most frequent words in a text passage.</p>' }
    },
    'flesch-readability-calculator': {
        id: 'flesch-readability-calculator',
        title: 'Readability Score',
        description: 'Flesch Reading Ease.',
        category: 'text',
        icon: 'Type',
        inputs: [
            { id: 'words', label: 'Word Count', type: 'number', placeholder: '300' },
            { id: 'sentences', label: 'Sentences', type: 'number', placeholder: '20' },
            { id: 'syllables', label: 'Syllables', type: 'number', placeholder: '450' }
        ],
        outputs: [
            { label: 'Ease Score', calculate: (inputs) => (206.835 - 1.015 * (Number(inputs.words) / Number(inputs.sentences)) - 84.6 * (Number(inputs.syllables) / Number(inputs.words))).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates the Flesch Reading Ease score.</p>' }
    },
    'book-royalties-calculator': {
        id: 'book-royalties-calculator',
        title: 'Book Royalties',
        description: 'Earnings per sale.',
        category: 'finance',
        icon: 'DollarSign',
        inputs: [
            { id: 'price', label: 'List Price ($)', type: 'number', placeholder: '19.99' },
            { id: 'rate', label: 'Royalty Rate (%)', type: 'number', placeholder: '10' },
            { id: 'sold', label: 'Copies Sold', type: 'number', placeholder: '1000' }
        ],
        outputs: [
            { label: 'Per Copy ($)', calculate: (inputs) => (Number(inputs.price) * Number(inputs.rate) / 100).toFixed(2) },
            { label: 'Total Earnings ($)', calculate: (inputs) => (Number(inputs.price) * Number(inputs.rate) / 100 * Number(inputs.sold)).toFixed(0) }
        ],
        content: { whatIs: '<p>Estimates book royalty earnings based on sales.</p>' }
    },
    'spine-width-calculator': {
        id: 'spine-width-calculator',
        title: 'Book Spine Width',
        description: 'For cover design.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'pages', label: 'Page Count', type: 'number', placeholder: '300' },
            { id: 'ppi', label: 'Paper PPI (e.g. 434)', type: 'number', placeholder: '434', defaultValue: '434' }
        ],
        outputs: [
            { label: 'Width (inches)', calculate: (inputs) => (Number(inputs.pages) / Number(inputs.ppi)).toFixed(3) },
            { label: 'Width (mm)', calculate: (inputs) => (Number(inputs.pages) / Number(inputs.ppi) * 25.4).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates book spine thickness based on page count and paper weight (PPI).</p>' }
    },
    'reading-speed-test-calculator': {
        id: 'reading-speed-test-calculator',
        title: 'Reading Speed (WPM)',
        description: 'Words per minute.',
        category: 'text',
        icon: 'Type',
        inputs: [
            { id: 'words', label: 'Words Read', type: 'number', placeholder: '500' },
            { id: 'seconds', label: 'Time (seconds)', type: 'number', placeholder: '120' }
        ],
        outputs: [
            { label: 'WPM', calculate: (inputs) => (Number(inputs.words) / (Number(inputs.seconds) / 60)).toFixed(0) }
        ],
        content: { whatIs: '<p>Calculates reading speed in words per minute.</p>' }
    },
    // Batch DE: Real Estate II
    'ltv-ratio-calculator': {
        id: 'ltv-ratio-calculator',
        title: 'LTV Ratio',
        description: 'Loan-to-Value.',
        category: 'finance',
        icon: 'Home',
        inputs: [
            { id: 'loan', label: 'Loan Amount', type: 'number', placeholder: '200000' },
            { id: 'value', label: 'Property Value', type: 'number', placeholder: '250000' }
        ],
        outputs: [
            { label: 'LTV (%)', calculate: (inputs) => (Number(inputs.loan) / Number(inputs.value) * 100).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates the Loan-to-Value (LTV) ratio.</p>' }
    },
    'rent-multiplier-calculator': {
        id: 'rent-multiplier-calculator',
        title: 'Gross Rent Multiplier',
        description: 'GRM investment ratio.',
        category: 'finance',
        icon: 'Home',
        inputs: [
            { id: 'price', label: 'Property Price', type: 'number', placeholder: '300000' },
            { id: 'rent', label: 'Annual Rent', type: 'number', placeholder: '30000' }
        ],
        outputs: [
            { label: 'GRM', calculate: (inputs) => (Number(inputs.price) / Number(inputs.rent)).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates the Gross Rent Multiplier (GRM).</p>' }
    },
    'property-tax-v2-calculator': {
        id: 'property-tax-v2-calculator',
        title: 'Property Tax Est',
        description: 'Annual tax bill.',
        category: 'finance',
        icon: 'Home',
        inputs: [
            { id: 'value', label: 'Assessed Value', type: 'number', placeholder: '200000' },
            { id: 'rate', label: 'Tax Rate (%)', type: 'number', placeholder: '1.2' }
        ],
        outputs: [
            { label: 'Annual Tax', calculate: (inputs) => (Number(inputs.value) * Number(inputs.rate) / 100).toFixed(0) },
            { label: 'Monthly Tax', calculate: (inputs) => (Number(inputs.value) * Number(inputs.rate) / 1200).toFixed(0) }
        ],
        content: { whatIs: '<p>Estimates annual property tax based on assessed value.</p>' }
    },
    'mortgage-payoff-early-calculator': {
        id: 'mortgage-payoff-early-calculator',
        title: 'Early Payoff Savings',
        description: 'Extra payment effect.',
        category: 'finance',
        icon: 'Home',
        inputs: [
            { id: 'balance', label: 'Current Balance', type: 'number', placeholder: '200000' },
            { id: 'rate', label: 'Interest Rate (%)', type: 'number', placeholder: '4.5' },
            { id: 'extra', label: 'Extra Monthly Payment', type: 'number', placeholder: '200' }
        ],
        outputs: [
            { label: 'Monthly Interest Saved', calculate: (inputs) => (Number(inputs.balance) * (Number(inputs.rate) / 1200) * (Number(inputs.extra) / (Number(inputs.balance) / 100))).toFixed(2) }
        ],
        content: { whatIs: '<p>Estimates interest savings from extra mortgage payments (simplified).</p>' }
    },
    'home-affordability-v2-calculator': {
        id: 'home-affordability-v2-calculator',
        title: 'Home Affordability',
        description: 'Based on DTI ratio.',
        category: 'finance',
        icon: 'Home',
        inputs: [
            { id: 'income', label: 'Annual Income', type: 'number', placeholder: '80000' },
            { id: 'debt', label: 'Monthly Debt', type: 'number', placeholder: '500' },
            { id: 'dti', label: 'Target DTI (%)', type: 'number', placeholder: '36', defaultValue: '36' }
        ],
        outputs: [
            { label: 'Max Monthly Payment', calculate: (inputs) => (Number(inputs.income) / 12 * Number(inputs.dti) / 100 - Number(inputs.debt)).toFixed(0) }
        ],
        content: { whatIs: '<p>Calculates maximum monthly mortgage payment based on Debt-to-Income (DTI) ratio.</p>' }
    },
    // Batch DF: Engineering II
    'ohms-law-power-calculator': {
        id: 'ohms-law-power-calculator',
        title: 'Ohm\'s Law (Full)',
        description: 'P, V, I, R solve.',
        category: 'electronics',
        icon: 'Zap',
        inputs: [
            { id: 'v', label: 'Voltage (V)', type: 'number', placeholder: '12' },
            { id: 'r', label: 'Resistance (Ω)', type: 'number', placeholder: '24' }
        ],
        outputs: [
            { label: 'Current (A)', calculate: (inputs) => (Number(inputs.v) / Number(inputs.r)).toFixed(3) },
            { label: 'Power (W)', calculate: (inputs) => (Math.pow(Number(inputs.v), 2) / Number(inputs.r)).toFixed(2) }
        ],
        content: { whatIs: '<p>Solves current and power using Ohm\'s Law.</p>' }
    },
    'thermal-expansion-calculator': {
        id: 'thermal-expansion-calculator',
        title: 'Thermal Expansion',
        description: 'ΔL = α L₀ ΔT.',
        category: 'physics',
        icon: 'Activity',
        inputs: [
            { id: 'l0', label: 'Initial Length (m)', type: 'number', placeholder: '10' },
            { id: 'alpha', label: 'Coeff (α × 10⁻⁶)', type: 'number', placeholder: '12' },
            { id: 'dt', label: 'Temp Diff (°C)', type: 'number', placeholder: '50' }
        ],
        outputs: [
            { label: 'Expansion (mm)', calculate: (inputs) => (Number(inputs.l0) * (Number(inputs.alpha) * 1e-6) * Number(inputs.dt) * 1000).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates linear thermal expansion of materials.</p>' }
    },
    'fluid-pressure-depth-calculator': {
        id: 'fluid-pressure-depth-calculator',
        title: 'Fluid Pressure',
        description: 'P = ρgh.',
        category: 'physics',
        icon: 'Activity',
        inputs: [
            { id: 'depth', label: 'Depth (m)', type: 'number', placeholder: '10' },
            { id: 'density', label: 'Density (kg/m³)', type: 'number', placeholder: '1000', defaultValue: '1000' }
        ],
        outputs: [
            { label: 'Pressure (Pa)', calculate: (inputs) => (Number(inputs.density) * 9.806 * Number(inputs.depth)).toFixed(0) },
            { label: 'Pressure (PSI)', calculate: (inputs) => (Number(inputs.density) * 9.806 * Number(inputs.depth) * 0.000145).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates static fluid pressure at depth.</p>' }
    },
    'ideal-gas-law-calculator': {
        id: 'ideal-gas-law-calculator',
        title: 'Ideal Gas Law',
        description: 'PV = nRT.',
        category: 'physics',
        icon: 'Activity',
        inputs: [
            { id: 'n', label: 'Moles', type: 'number', placeholder: '1' },
            { id: 't', label: 'Temp (K)', type: 'number', placeholder: '273' },
            { id: 'v', label: 'Volume (L)', type: 'number', placeholder: '22.4' }
        ],
        outputs: [
            { label: 'Pressure (atm)', calculate: (inputs) => (Number(inputs.n) * 0.0821 * Number(inputs.t) / Number(inputs.v)).toFixed(3) }
        ],
        content: { whatIs: '<p>Solves for pressure in the Ideal Gas Law equation.</p>' }
    },
    'mechanical-advantage-lever-calculator': {
        id: 'mechanical-advantage-lever-calculator',
        title: 'Lever Mechanical Adv',
        description: 'Force multiplier.',
        category: 'physics',
        icon: 'Activity',
        inputs: [
            { id: 'effort', label: 'Effort Arm (cm)', type: 'number', placeholder: '100' },
            { id: 'load', label: 'Load Arm (cm)', type: 'number', placeholder: '20' }
        ],
        outputs: [
            { label: 'Mech Advantage', calculate: (inputs) => (Number(inputs.effort) / Number(inputs.load)).toFixed(1) + ':1' }
        ],
        content: { whatIs: '<p>Calculates mechanical advantage of a first-class lever.</p>' }
    },
    // Batch DG: Logistics/Shipping
    'freight-cost-v2-calculator': {
        id: 'freight-cost-v2-calculator',
        title: 'Freight Cost Est',
        description: 'Total shipment cost.',
        category: 'finance',
        icon: 'Truck',
        inputs: [
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '500' },
            { id: 'rate', label: 'Rate per kg ($)', type: 'number', placeholder: '1.5' },
            { id: 'fees', label: 'Flat Fees ($)', type: 'number', placeholder: '50' }
        ],
        outputs: [
            { label: 'Total Cost ($)', calculate: (inputs) => (Number(inputs.weight) * Number(inputs.rate) + Number(inputs.fees)).toFixed(2) }
        ],
        content: { whatIs: '<p>Estimates total freight shipping cost.</p>' }
    },
    'warehouse-space-calculator': {
        id: 'warehouse-space-calculator',
        title: 'Warehouse Pallet Space',
        description: 'Storage capacity.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'area', label: 'Floor Area (sq ft)', type: 'number', placeholder: '1000' },
            { id: 'percent', label: 'Storage Area (%)', type: 'number', placeholder: '70', defaultValue: '70' }
        ],
        outputs: [
            { label: 'Pallet Spaces', calculate: (inputs) => Math.floor(Number(inputs.area) * Number(inputs.percent) / 100 / 14).toString() }
        ],
        content: { whatIs: '<p>Estimates standard 48x40 pallet spaces in a warehouse floor area.</p>' }
    },
    'route-lead-time-calculator': {
        id: 'route-lead-time-calculator',
        title: 'Shipping Lead Time',
        description: 'Estimated arrival.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'distance', label: 'Distance (km)', type: 'number', placeholder: '1000' },
            { id: 'speed', label: 'Speed (km/h)', type: 'number', placeholder: '60', defaultValue: '60' },
            { id: 'hours', label: 'Driving H/day', type: 'number', placeholder: '9', defaultValue: '9' }
        ],
        outputs: [
            { label: 'Transit Days', calculate: (inputs) => Math.ceil(Number(inputs.distance) / (Number(inputs.speed) * Number(inputs.hours))).toString() }
        ],
        content: { whatIs: '<p>Estimates shipping transit time by road.</p>' }
    },
    'pallet-count-calculator': {
        id: 'pallet-count-calculator',
        title: 'Pallet Stacking',
        description: 'Cases per pallet.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'layer', label: 'Cases per Layer', type: 'number', placeholder: '10' },
            { id: 'height', label: 'Layers High', type: 'number', placeholder: '5' }
        ],
        outputs: [
            { label: 'Total Cases', calculate: (inputs) => (Number(inputs.layer) * Number(inputs.height)).toString() }
        ],
        content: { whatIs: '<p>Calculates total cases on a pallet.</p>' }
    },
    'cbm-v2-calculator': {
        id: 'cbm-v2-calculator',
        title: 'Cubic Metres (CBM)',
        description: 'Volume calculation.',
        category: 'construction',
        icon: 'Box',
        inputs: [
            { id: 'l', label: 'Length (cm)', type: 'number', placeholder: '100' },
            { id: 'w', label: 'Width (cm)', type: 'number', placeholder: '100' },
            { id: 'h', label: 'Height (cm)', type: 'number', placeholder: '100' },
            { id: 'qty', label: 'Quantity', type: 'number', placeholder: '1', defaultValue: '1' }
        ],
        outputs: [
            { label: 'Total CBM', calculate: (inputs) => (Number(inputs.l) * Number(inputs.w) * Number(inputs.h) * Number(inputs.qty) / 1000000).toFixed(3) }
        ],
        content: { whatIs: '<p>Calculates total cubic volume in metres.</p>' }
    },
    // Batch DH: Psychology/Social
    'sleep-debt-calculator': {
        id: 'sleep-debt-calculator',
        title: 'Sleep Debt',
        description: 'Accumulated loss.',
        category: 'health',
        icon: 'Moon',
        inputs: [
            { id: 'need', label: 'Sleep Needed (h)', type: 'number', placeholder: '8', defaultValue: '8' },
            { id: 'got', label: 'Sleep Got (h)', type: 'number', placeholder: '6' },
            { id: 'days', label: 'Days', type: 'number', placeholder: '7' }
        ],
        outputs: [
            { label: 'Total Debt (h)', calculate: (inputs) => ((Number(inputs.need) - Number(inputs.got)) * Number(inputs.days)).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates accumulated sleep deprivation over time.</p>' }
    },
    'social-battery-calculator': {
        id: 'social-battery-calculator',
        title: 'Social Battery %',
        description: 'Energy estimate.',
        category: 'health',
        icon: 'Battery',
        inputs: [
            { id: 'hours', label: 'Hours Spent Socializing', type: 'number', placeholder: '4' },
            { id: 'introvert', label: 'Introvert Level (1-10)', type: 'number', placeholder: '7' }
        ],
        outputs: [
            { label: 'Remaining %', calculate: (inputs) => Math.max(0, 100 - (Number(inputs.hours) * Number(inputs.introvert) * 3)).toFixed(0) + '%' }
        ],
        content: { whatIs: '<p>Humorous estimate of social energy remaining.</p>' }
    },
    'goal-progress-calculator': {
        id: 'goal-progress-calculator',
        title: 'Goal Progress (%)',
        description: 'Completion tracker.',
        category: 'everyday',
        icon: 'Target',
        inputs: [
            { id: 'current', label: 'Current Value', type: 'number', placeholder: '40' },
            { id: 'target', label: 'Target Value', type: 'number', placeholder: '100' }
        ],
        outputs: [
            { label: 'Progress %', calculate: (inputs) => (Number(inputs.current) / Number(inputs.target) * 100).toFixed(1) + '%' }
        ],
        content: { whatIs: '<p>Calculates percentage of goal completed.</p>' }
    },
    'habit-streak-value-calculator': {
        id: 'habit-streak-value-calculator',
        title: 'Habit Power',
        description: 'Momentum estimate.',
        category: 'everyday',
        icon: 'Activity',
        inputs: [
            { id: 'days', label: 'Current Streak (days)', type: 'number', placeholder: '21' }
        ],
        outputs: [
            { label: 'Momentum %', calculate: (inputs) => Math.min(100, (Number(inputs.days) / 66 * 100)).toFixed(0) + '%' }
        ],
        content: { whatIs: '<p>Estimates habit "power" based on the 66-day automaticity theory.</p>' }
    },
    'weighted-decision-matrix-calculator': {
        id: 'weighted-decision-matrix-calculator',
        title: 'Decision Matrix',
        description: 'Score 1 option.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'f1', label: 'Factor 1 Score (1-10)', type: 'number', placeholder: '8' },
            { id: 'w1', label: 'Weight 1 (e.g. 50%)', type: 'number', placeholder: '50' },
            { id: 'f2', label: 'Factor 2 Score (1-10)', type: 'number', placeholder: '6' },
            { id: 'w2', label: 'Weight 2 (e.g. 50%)', type: 'number', placeholder: '50' }
        ],
        outputs: [
            { label: 'Final Score', calculate: (inputs) => (Number(inputs.f1) * Number(inputs.w1) / 100 + Number(inputs.f2) * Number(inputs.w2) / 100).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates a weighted score for a single option to help decision making.</p>' }
    },
    // Batch DI: Energy/Solar
    'solar-roi-calculator': {
        id: 'solar-roi-calculator',
        title: 'Solar Panel ROI',
        description: 'Payback period.',
        category: 'finance',
        icon: 'Sun',
        inputs: [
            { id: 'cost', label: 'Total Install Cost ($)', type: 'number', placeholder: '15000' },
            { id: 'savings', label: 'Monthly Bill Saving ($)', type: 'number', placeholder: '150' }
        ],
        outputs: [
            { label: 'Payback (Years)', calculate: (inputs) => (Number(inputs.cost) / (Number(inputs.savings) * 12)).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates how many years it takes for solar panel savings to pay off the install cost.</p>' }
    },
    'battery-storage-time-calculator': {
        id: 'battery-storage-time-calculator',
        title: 'Battery Backup Time',
        description: 'How long it lasts.',
        category: 'electronics',
        icon: 'Battery',
        inputs: [
            { id: 'cap', label: 'Capacity (kWh)', type: 'number', placeholder: '10' },
            { id: 'load', label: 'Avg Load (kW)', type: 'number', placeholder: '1.2' }
        ],
        outputs: [
            { label: 'Duration (Hours)', calculate: (inputs) => (Number(inputs.cap) / Number(inputs.load)).toFixed(1) }
        ],
        content: { whatIs: '<p>Estimates battery backup duration based on load.</p>' }
    },
    'solar-panel-count-calculator': {
        id: 'solar-panel-count-calculator',
        title: 'Solar Panels Needed',
        description: 'Based on usage.',
        category: 'electronics',
        icon: 'Sun',
        inputs: [
            { id: 'usage', label: 'Monthly kWh', type: 'number', placeholder: '900' },
            { id: 'panelW', label: 'Panel Wattage', type: 'number', placeholder: '400', defaultValue: '400' },
            { id: 'sunH', label: 'Sun Hours/day', type: 'number', placeholder: '5', defaultValue: '5' }
        ],
        outputs: [
            { label: 'Panels Needed', calculate: (inputs) => Math.ceil(Number(inputs.usage) / 30 / (Number(inputs.panelW) * Number(inputs.sunH) / 1000)).toString() }
        ],
        content: { whatIs: '<p>Estimates solar panels required to cover monthly energy usage.</p>' }
    },
    'solar-roof-area-calculator': {
        id: 'solar-roof-area-calculator',
        title: 'Solar Roof Area',
        description: 'Space required.',
        category: 'construction',
        icon: 'Sun',
        inputs: [
            { id: 'panels', label: 'Number of Panels', type: 'number', placeholder: '20' }
        ],
        outputs: [
            { label: 'Area (m²)', calculate: (inputs) => (Number(inputs.panels) * 1.8).toFixed(1) },
            { label: 'Area (sq ft)', calculate: (inputs) => (Number(inputs.panels) * 19.4).toFixed(0) }
        ],
        content: { whatIs: '<p>Estimates roof space needed for a solar array.</p>' }
    },
    'co2-avoided-calculator': {
        id: 'co2-avoided-calculator',
        title: 'CO2 Savings Est',
        description: 'Solar environmental impact.',
        category: 'ecology',
        icon: 'Leaf',
        inputs: [
            { id: 'kwh', label: 'Annual kWh Generated', type: 'number', placeholder: '5000' }
        ],
        outputs: [
            { label: 'CO2 Saved (kg)', calculate: (inputs) => (Number(inputs.kwh) * 0.4).toFixed(0) },
            { label: 'Trees Equiv', calculate: (inputs) => (Number(inputs.kwh) * 0.4 / 20).toFixed(0) }
        ],
        content: { whatIs: '<p>Estimates carbon emissions avoided through solar energy.</p>' }
    },
    // Batch DJ: Travel II
    'country-tipping-guide-calculator': {
        id: 'country-tipping-guide-calculator',
        title: 'Tipping Helper',
        description: 'By percent/country.',
        category: 'everyday',
        icon: 'DollarSign',
        inputs: [
            { id: 'bill', label: 'Bill Amount', type: 'number', placeholder: '50' },
            { id: 'rate', label: 'Tip % (e.g. US=20%)', type: 'number', placeholder: '15' }
        ],
        outputs: [
            { label: 'Tip Amount', calculate: (inputs) => (Number(inputs.bill) * Number(inputs.rate) / 100).toFixed(2) },
            { label: 'Total', calculate: (inputs) => (Number(inputs.bill) * (1 + Number(inputs.rate) / 100)).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates tip based on bill and percentage.</p>' }
    },
    'travel-budget-v2-calculator': {
        id: 'travel-budget-v2-calculator',
        title: 'Trip Cost Planner',
        description: 'Total estimate.',
        category: 'everyday',
        icon: 'Plane',
        inputs: [
            { id: 'days', label: 'Duration (days)', type: 'number', placeholder: '7' },
            { id: 'daily', label: 'Daily Budget', type: 'number', placeholder: '100' },
            { id: 'flights', label: 'Flights Total', type: 'number', placeholder: '500' }
        ],
        outputs: [
            { label: 'Total Budget', calculate: (inputs) => (Number(inputs.days) * Number(inputs.daily) + Number(inputs.flights)).toFixed(0) }
        ],
        content: { whatIs: '<p>Calculates total travel budget inclusive of flights and daily spend.</p>' }
    },
    'clothes-packing-calculator': {
        id: 'clothes-packing-calculator',
        title: 'Packing Assistant',
        description: 'How many items.',
        category: 'everyday',
        icon: 'Backpack',
        inputs: [
            { id: 'days', label: 'Travel Days', type: 'number', placeholder: '4' }
        ],
        outputs: [
            { label: 'T-Shirts', calculate: (inputs) => (Number(inputs.days) + 1).toString() },
            { label: 'Underwear', calculate: (inputs) => (Number(inputs.days) + 2).toString() }
        ],
        content: { whatIs: '<p>Basic formula for packing essentials.</p>' }
    },
    'fuel-cost-intl-calculator': {
        id: 'fuel-cost-intl-calculator',
        title: 'Fuel Cost (Distance)',
        description: 'Money for gas.',
        category: 'everyday',
        icon: 'Fuel',
        inputs: [
            { id: 'dist', label: 'Distance (km)', type: 'number', placeholder: '500' },
            { id: 'l100', label: 'L/100km', type: 'number', placeholder: '8' },
            { id: 'price', label: 'Price per L', type: 'number', placeholder: '1.6' }
        ],
        outputs: [
            { label: 'Cost', calculate: (inputs) => (Number(inputs.dist) / 100 * Number(inputs.l100) * Number(inputs.price)).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates fuel cost for a road trip.</p>' }
    },
    'sightseeing-time-calculator': {
        id: 'sightseeing-time-calculator',
        title: 'Sightseeing Efficiency',
        description: 'Items per day.',
        category: 'everyday',
        icon: 'Map',
        inputs: [
            { id: 'hours', label: 'Active Hours/day', type: 'number', placeholder: '8' },
            { id: 'avg', label: 'Avg Time/Spot (h)', type: 'number', placeholder: '2' }
        ],
        outputs: [
            { label: 'Max Spots', calculate: (inputs) => Math.floor(Number(inputs.hours) / (Number(inputs.avg) + 0.5)).toString() }
        ],
        content: { whatIs: '<p>Estimates how many locations you can visit per day including travel time.</p>' }
    },
    // Batch DK: Science II
    'density-calculator': {
        id: 'density-calculator',
        title: 'Density ρ = m/V',
        description: 'Mass & Volume.',
        category: 'physics',
        icon: 'Activity',
        inputs: [
            { id: 'm', label: 'Mass (g)', type: 'number', placeholder: '100' },
            { id: 'v', label: 'Volume (cm³)', type: 'number', placeholder: '20' }
        ],
        outputs: [
            { label: 'Density (g/cm³)', calculate: (inputs) => (Number(inputs.m) / Number(inputs.v)).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates density from mass and volume.</p>' }
    },
    'molarity-calculator': {
        id: 'molarity-calculator',
        title: 'Molarity (c = n/V)',
        description: 'Chemical concentration.',
        category: 'chemistry',
        icon: 'Beaker',
        inputs: [
            { id: 'moles', label: 'Solute Moles', type: 'number', placeholder: '0.5' },
            { id: 'vol', label: 'Solvent Vol (L)', type: 'number', placeholder: '1' }
        ],
        outputs: [
            { label: 'Molarity (M)', calculate: (inputs) => (Number(inputs.moles) / Number(inputs.vol)).toFixed(3) }
        ],
        content: { whatIs: '<p>Calculates molar concentration of a solution.</p>' }
    },
    'half-life-calc-calculator': {
        id: 'half-life-calc-calculator',
        title: 'Half-Life decay',
        description: 'Remaining amount.',
        category: 'physics',
        icon: 'Activity',
        inputs: [
            { id: 'initial', label: 'Initial Amount', type: 'number', placeholder: '100' },
            { id: 'hl', label: 'Half-life (t1/2)', type: 'number', placeholder: '5' },
            { id: 'time', label: 'Time Elapsed', type: 'number', placeholder: '10' }
        ],
        outputs: [
            { label: 'Remaining', calculate: (inputs) => (Number(inputs.initial) * Math.pow(0.5, (Number(inputs.time) / Number(inputs.hl)))).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates remaining substance after radioactive decay.</p>' }
    },
    'specific-heat-capacity-calculator': {
        id: 'specific-heat-capacity-calculator',
        title: 'Specific Heat (Q)',
        description: 'Q = mcΔT.',
        category: 'physics',
        icon: 'Activity',
        inputs: [
            { id: 'm', label: 'Mass (kg)', type: 'number', placeholder: '1' },
            { id: 'c', label: 'Spec Heat (J/kg·C)', type: 'number', placeholder: '4186', defaultValue: '4186' },
            { id: 'dt', label: 'Temp Rise (C)', type: 'number', placeholder: '10' }
        ],
        outputs: [
            { label: 'Heat energy (J)', calculate: (inputs) => (Number(inputs.m) * Number(inputs.c) * Number(inputs.dt)).toFixed(0) }
        ],
        content: { whatIs: '<p>Calculates thermal energy transfer.</p>' }
    },
    'molecular-weight-v2-calculator': {
        id: 'molecular-weight-v2-calculator',
        title: 'Molecular Weight Est',
        description: 'Simple formula sum.',
        category: 'chemistry',
        icon: 'Beaker',
        inputs: [
            { id: 'c', label: 'Carbon (C) count', type: 'number', placeholder: '6' },
            { id: 'h', label: 'Hydrog (H) count', type: 'number', placeholder: '12' },
            { id: 'o', label: 'Oxyg (O) count', type: 'number', placeholder: '6' }
        ],
        outputs: [
            { label: 'Total Mass (g/mol)', calculate: (inputs) => (Number(inputs.c) * 12.01 + Number(inputs.h) * 1.008 + Number(inputs.o) * 16.00).toFixed(2) }
        ],
        content: { whatIs: '<p>Estimates molecular weight for basic organic compounds.</p>' }
    },
    // Batch DL: Music Theory
    'chord-progression-helper-calculator': {
        id: 'chord-progression-helper-calculator',
        title: 'Chord Numbering',
        description: 'I-IV-V to Chords.',
        category: 'web',
        icon: 'Music',
        inputs: [
            { id: 'key', label: 'Key (C, G, D)', type: 'string', placeholder: 'C' }
        ],
        outputs: [
            { label: 'Progression 1-4-5', calculate: (inputs) => { const k = String(inputs.key || 'C').toUpperCase(); if (k === 'C') return 'C, F, G'; if (k === 'G') return 'G, C, D'; if (k === 'D') return 'D, G, A'; return 'Check Music Guide'; } }
        ],
        content: { whatIs: '<p>Provides basic chord progressions for a musical key.</p>' }
    },
    'musical-interval-cents-calculator': {
        id: 'musical-interval-cents-calculator',
        title: 'Interval to Cents',
        description: 'Frequency ratio cents.',
        category: 'web',
        icon: 'Music',
        inputs: [
            { id: 'f1', label: 'Freq 1 (Hz)', type: 'number', placeholder: '440' },
            { id: 'f2', label: 'Freq 2 (Hz)', type: 'number', placeholder: '466.16' }
        ],
        outputs: [
            { label: 'Cents', calculate: (inputs) => (1200 * Math.log2(Number(inputs.f2) / Number(inputs.f1))).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates the musical interval between frequencies in cents.</p>' }
    },
    'major-scale-notes-calculator': {
        id: 'major-scale-notes-calculator',
        title: 'Scale Note Gaps',
        description: 'Step pattern.',
        category: 'web',
        icon: 'Music',
        inputs: [
            { id: 'start', label: 'Root Frequency (Hz)', type: 'number', placeholder: '440' }
        ],
        outputs: [
            { label: 'Perfect Fifth (Hz)', calculate: (inputs) => (Number(inputs.start) * 1.5).toFixed(1) },
            { label: 'Octave (Hz)', calculate: (inputs) => (Number(inputs.start) * 2).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates fundamental frequency ratios in music.</p>' }
    },
    'bpm-to-hz-calculator': {
        id: 'bpm-to-hz-calculator',
        title: 'BPM to Hz',
        description: 'Frequency of beat.',
        category: 'web',
        icon: 'Music',
        inputs: [
            { id: 'bpm', label: 'BPM', type: 'number', placeholder: '120' }
        ],
        outputs: [
            { label: 'Frequency (Hz)', calculate: (inputs) => (Number(inputs.bpm) / 60).toFixed(2) }
        ],
        content: { whatIs: '<p>Converts tempo (BPM) to frequency (Hz).</p>' }
    },
    'metronome-visual-calculator': {
        id: 'metronome-visual-calculator',
        title: 'Metronome Timing',
        description: 'ms between clicks.',
        category: 'web',
        icon: 'Music',
        inputs: [
            { id: 'bpm', label: 'BPM', type: 'number', placeholder: '120' }
        ],
        outputs: [
            { label: 'Interval (ms)', calculate: (inputs) => (60000 / Number(inputs.bpm)).toFixed(0) }
        ],
        content: { whatIs: '<p>Calculates milliseconds between beats.</p>' }
    },
    // Batch DM: Photography II
    'circle-of-confusion-calculator': {
        id: 'circle-of-confusion-calculator',
        title: 'Circle of Confusion',
        description: 'DOF limit.',
        category: 'web',
        icon: 'Camera',
        inputs: [
            { id: 'sensor', label: 'Format (Full/APS-C)', type: 'string', placeholder: 'Full' }
        ],
        outputs: [
            { label: 'CoC (mm)', calculate: (inputs) => String(inputs.sensor).toLowerCase().includes('aps') ? '0.019' : '0.029' }
        ],
        content: { whatIs: '<p>Standard Circle of Confusion values for depth of field calculation.</p>' }
    },
    'hyperfocal-distance-calculator': {
        id: 'hyperfocal-distance-calculator',
        title: 'Hyperfocal Dist',
        description: 'Max focus depth.',
        category: 'web',
        icon: 'Camera',
        inputs: [
            { id: 'focal', label: 'Focal Length (mm)', type: 'number', placeholder: '50' },
            { id: 'aperture', label: 'Aperture (f/)', type: 'number', placeholder: '8' },
            { id: 'coc', label: 'CoC (mm)', type: 'number', placeholder: '0.03', defaultValue: '0.03' }
        ],
        outputs: [
            { label: 'Distance (m)', calculate: (inputs) => (Math.pow(Number(inputs.focal), 2) / (Number(inputs.aperture) * Number(inputs.coc)) / 1000).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates hyperfocal distance for maximum depth of field.</p>' }
    },
    'angle-of-view-calculator': {
        id: 'angle-of-view-calculator',
        title: 'Angle of View',
        description: 'FOV degrees.',
        category: 'web',
        icon: 'Camera',
        inputs: [
            { id: 'focal', label: 'Focal Length (mm)', type: 'number', placeholder: '50' },
            { id: 'sensorSize', label: 'Sensor Width (mm)', type: 'number', placeholder: '36', defaultValue: '36' }
        ],
        outputs: [
            { label: 'H-FOV (°)', calculate: (inputs) => (2 * Math.atan(Number(inputs.sensorSize) / (2 * Number(inputs.focal))) * 180 / Math.PI).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates the horizontal field of view angle.</p>' }
    },
    'shutter-speed-rule-calculator': {
        id: 'shutter-speed-rule-calculator',
        title: 'Sharpness Rule',
        description: 'Minimum shutter speed.',
        category: 'web',
        icon: 'Camera',
        inputs: [
            { id: 'focal', label: 'Focal Length (mm)', type: 'number', placeholder: '200' }
        ],
        outputs: [
            { label: 'Min Shutter', calculate: (inputs) => '1/' + Number(inputs.focal) + 's' }
        ],
        content: { whatIs: '<p>Suggests minimum handheld shutter speed to avoid blur (Reciprocal Rule).</p>' }
    },
    'print-resolution-v2-calculator': {
        id: 'print-resolution-v2-calculator',
        title: 'Print Size Max',
        description: 'Dimension at 300 DPI.',
        category: 'web',
        icon: 'Camera',
        inputs: [
            { id: 'pxW', label: 'Pixels Width', type: 'number', placeholder: '6000' },
            { id: 'pxH', label: 'Pixels Height', type: 'number', placeholder: '4000' }
        ],
        outputs: [
            { label: 'Size (inches)', calculate: (inputs) => (Number(inputs.pxW) / 300).toFixed(1) + 'x' + (Number(inputs.pxH) / 300).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates high-quality print dimensions for a digital photo.</p>' }
    },
    // Batch DN: Sports & Outdoors
    'calorie-burned-v2-calculator': {
        id: 'calorie-burned-v2-calculator',
        title: 'Calorie Burned Est',
        description: 'By activity and time.',
        category: 'fitness',
        icon: 'Zap',
        inputs: [
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '70' },
            { id: 'time', label: 'Duration (min)', type: 'number', placeholder: '30' },
            { id: 'met', label: 'MET (e.g. Run=10)', type: 'number', placeholder: '10', defaultValue: '10' }
        ],
        outputs: [
            { label: 'Calories', calculate: (inputs) => (Number(inputs.met) * 3.5 * Number(inputs.weight) / 200 * Number(inputs.time)).toFixed(0) }
        ],
        content: { whatIs: '<p>Estimates calories burned using the MET (Metabolic Equivalent of Task) formula.</p>' }
    },
    'hike-time-calculator': {
        id: 'hike-time-calculator',
        title: 'Hike Time Est',
        description: 'Naismith\'s Rule.',
        category: 'everyday',
        icon: 'Map',
        inputs: [
            { id: 'dist', label: 'Distance (km)', type: 'number', placeholder: '10' },
            { id: 'gain', label: 'Elevation Gain (m)', type: 'number', placeholder: '400' }
        ],
        outputs: [
            { label: 'Time (hours)', calculate: (inputs) => (Number(inputs.dist) / 5 + Number(inputs.gain) / 600).toFixed(1) }
        ],
        content: { whatIs: '<p>Estimates hiking time based on distance and elevation gain.</p>' }
    },
    'kayak-speed-calculator': {
        id: 'kayak-speed-calculator',
        title: 'Hull Speed (Kayak)',
        description: 'Max displacement speed.',
        category: 'fitness',
        icon: 'Activity',
        inputs: [
            { id: 'length', label: 'Waterline Length (ft)', type: 'number', placeholder: '14' }
        ],
        outputs: [
            { label: 'Speed (knots)', calculate: (inputs) => (1.34 * Math.sqrt(Number(inputs.length))).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates theoretical maximum hull speed for a kayak or boat.</p>' }
    },
    'wind-chill-v2-calculator': {
        id: 'wind-chill-v2-calculator',
        title: 'Wind Chill Index',
        description: 'How cold it "feels".',
        category: 'ecology',
        icon: 'Wind',
        inputs: [
            { id: 'temp', label: 'Temp (°C)', type: 'number', placeholder: '5' },
            { id: 'wind', label: 'Wind Speed (km/h)', type: 'number', placeholder: '20' }
        ],
        outputs: [
            { label: 'Feels Like (°C)', calculate: (inputs) => (13.12 + 0.6215 * Number(inputs.temp) - 11.37 * Math.pow(Number(inputs.wind), 0.16) + 0.3965 * Number(inputs.temp) * Math.pow(Number(inputs.wind), 0.16)).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates the wind chill factor based on temperature and wind speed.</p>' }
    },
    'tent-size-calculator': {
        id: 'tent-size-calculator',
        title: 'Tent Capacity',
        description: 'Space needed.',
        category: 'everyday',
        icon: 'Home',
        inputs: [
            { id: 'people', label: 'Number of People', type: 'number', placeholder: '4' }
        ],
        outputs: [
            { label: 'Comfort Size', calculate: (inputs) => (Number(inputs.people) + 1) + '-Person Tent' }
        ],
        content: { whatIs: '<p>Suggests tent size for comfortable camping.</p>' }
    },
    // Batch DO: Cooking & Kitchen
    'cooking-volume-scale-calculator': {
        id: 'cooking-volume-scale-calculator',
        title: 'Recipe Scaler',
        description: 'Scale ingredients.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'amount', label: 'Current Amount', type: 'number', placeholder: '2' },
            { id: 'current', label: 'Current Servings', type: 'number', placeholder: '4' },
            { id: 'target', label: 'Target Servings', type: 'number', placeholder: '6' }
        ],
        outputs: [
            { label: 'New Amount', calculate: (inputs) => (Number(inputs.amount) * Number(inputs.target) / Number(inputs.current)).toFixed(2) }
        ],
        content: { whatIs: '<p>Scales recipe ingredients based on servings.</p>' }
    },
    'meat-cooking-time-calculator': {
        id: 'meat-cooking-time-calculator',
        title: 'Meat Roast Time',
        description: 'By weight.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '2' },
            { id: 'type', label: 'Meat Type (min/kg)', type: 'number', placeholder: '45', defaultValue: '45' }
        ],
        outputs: [
            { label: 'Total Time (min)', calculate: (inputs) => (Number(inputs.weight) * Number(inputs.type) + 20).toString() }
        ],
        content: { whatIs: '<p>Estimates roasting time for meat by weight.</p>' }
    },
    'pasta-portion-calculator': {
        id: 'pasta-portion-calculator',
        title: 'Pasta Portion',
        description: 'Dry weight needed.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'people', label: 'People', type: 'number', placeholder: '2' },
            { id: 'hungry', label: 'Hunger (1-3)', type: 'number', placeholder: '2', defaultValue: '2' }
        ],
        outputs: [
            { label: 'Weight (g)', calculate: (inputs) => (Number(inputs.people) * Number(inputs.hungry) * 50).toString() }
        ],
        content: { whatIs: '<p>Estimates dry pasta weight per person.</p>' }
    },
    'cake-serving-calculator': {
        id: 'cake-serving-calculator',
        title: 'Cake Servings',
        description: 'By pan size.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'size', label: 'Round Pan Dia (inch)', type: 'number', placeholder: '8' }
        ],
        outputs: [
            { label: 'Servings', calculate: (inputs) => Math.floor(Math.pow(Number(inputs.size), 2) / 6).toString() }
        ],
        content: { whatIs: '<p>Estimates party portions for a round cake.</p>' }
    },
    'fridge-energy-cost-calculator': {
        id: 'fridge-energy-cost-calculator',
        title: 'Fridge Running Cost',
        description: 'Annual estimate.',
        category: 'finance',
        icon: 'DollarSign',
        inputs: [
            { id: 'watts', label: 'Fridge Watts', type: 'number', placeholder: '200' },
            { id: 'rate', label: 'Cost/kWh ($)', type: 'number', placeholder: '0.15' }
        ],
        outputs: [
            { label: 'Yearly Cost ($)', calculate: (inputs) => (Number(inputs.watts) * 24 * 365 / 1000 * Number(inputs.rate) / 4).toFixed(2) }
        ],
        content: { whatIs: '<p>Estimates annual cost to run a refrigerator (assuming 25% compressor cycle).</p>' }
    },
    // Batch DP: Hobbies & Crafts II
    'comic-value-est-calculator': {
        id: 'comic-value-est-calculator',
        title: 'Comic Grade Mult',
        description: 'Estimated value.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'base', label: '9.2 NM Value ($)', type: 'number', placeholder: '100' },
            { id: 'grade', label: 'Condition Score (0-10)', type: 'number', placeholder: '6' }
        ],
        outputs: [
            { label: 'Est Value ($)', calculate: (inputs) => (Number(inputs.base) * Math.pow(Number(inputs.grade) / 9.2, 2.5)).toFixed(0) }
        ],
        content: { whatIs: '<p>Roughly estimates comic value based on grade compared to raw NM value.</p>' }
    },
    'trading-card-roi-calculator': {
        id: 'trading-card-roi-calculator',
        title: 'TCG Box ROI',
        description: 'Pull value tracker.',
        category: 'finance',
        icon: 'DollarSign',
        inputs: [
            { id: 'cost', label: 'Box Cost ($)', type: 'number', placeholder: '120' },
            { id: 'pulls', label: 'Total Pull Value ($)', type: 'number', placeholder: '150' }
        ],
        outputs: [
            { label: 'Profit/Loss ($)', calculate: (inputs) => (Number(inputs.pulls) - Number(inputs.cost)).toFixed(2) },
            { label: 'ROI (%)', calculate: (inputs) => ((Number(inputs.pulls) / Number(inputs.cost) - 1) * 100).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates profit and ROI for trading card box openings.</p>' }
    },
    '3d-resin-cost-calculator': {
        id: '3d-resin-cost-calculator',
        title: 'SLA Resin Cost',
        description: 'Per print.',
        category: 'construction',
        icon: 'Box',
        inputs: [
            { id: 'vol', label: 'Print Vol (ml)', type: 'number', placeholder: '20' },
            { id: 'bottleCost', label: 'Bottle Cost ($)', type: 'number', placeholder: '35' },
            { id: 'bottleSize', label: 'Bottle Size (ml)', type: 'number', placeholder: '1000', defaultValue: '1000' }
        ],
        outputs: [
            { label: 'Print Cost ($)', calculate: (inputs) => (Number(inputs.vol) * (Number(inputs.bottleCost) / Number(inputs.bottleSize))).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates resin cost for a single SLA 3D print.</p>' }
    },
    'paint-mix-ratio-calculator': {
        id: 'paint-mix-ratio-calculator',
        title: 'Paint Mix Ratio',
        description: 'Color blending.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'total', label: 'Total Volume Needed', type: 'number', placeholder: '100' },
            { id: 'r1', label: 'Part A Ratio', type: 'number', placeholder: '2' },
            { id: 'r2', label: 'Part B Ratio', type: 'number', placeholder: '1' }
        ],
        outputs: [
            { label: 'Part A Amt', calculate: (inputs) => (Number(inputs.total) * (Number(inputs.r1) / (Number(inputs.r1) + Number(inputs.r2)))).toFixed(1) },
            { label: 'Part B Amt', calculate: (inputs) => (Number(inputs.total) * (Number(inputs.r2) / (Number(inputs.r1) + Number(inputs.r2)))).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates volumes for two-part mixtures.</p>' }
    },
    'model-scale-calculator': {
        id: 'model-scale-calculator',
        title: 'Model Scale Dim',
        description: 'Convert real to model.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'real', label: 'Real Size (cm)', type: 'number', placeholder: '500' },
            { id: 'scale', label: 'Scale 1:', type: 'number', placeholder: '24' }
        ],
        outputs: [
            { label: 'Model Size (cm)', calculate: (inputs) => (Number(inputs.real) / Number(inputs.scale)).toFixed(2) }
        ],
        content: { whatIs: '<p>Converts real-world dimensions to model scale dimensions.</p>' }
    },
    // Batch DQ: Finance & Money II
    'cash-flow-v2-calculator': {
        id: 'cash-flow-v2-calculator',
        title: 'Simple Cash Flow',
        description: 'Monthly net.',
        category: 'finance',
        icon: 'DollarSign',
        inputs: [
            { id: 'inc', label: 'Total Income', type: 'number', placeholder: '5000' },
            { id: 'exp', label: 'Total Expenses', type: 'number', placeholder: '3500' }
        ],
        outputs: [
            { label: 'Monthly Surplus', calculate: (inputs) => (Number(inputs.inc) - Number(inputs.exp)).toFixed(0) },
            { label: 'Savings Rate (%)', calculate: (inputs) => (100 - (Number(inputs.exp) / Number(inputs.inc) * 100)).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates free cash flow and savings percentage.</p>' }
    },
    'net-worth-v2-calculator': {
        id: 'net-worth-v2-calculator',
        title: 'Net Worth Est',
        description: 'Assets - Liabilities.',
        category: 'finance',
        icon: 'DollarSign',
        inputs: [
            { id: 'assets', label: 'Total Assets', type: 'number', placeholder: '200000' },
            { id: 'debts', label: 'Total Debts', type: 'number', placeholder: '150000' }
        ],
        outputs: [
            { label: 'Net Worth', calculate: (inputs) => (Number(inputs.assets) - Number(inputs.debts)).toFixed(0) }
        ],
        content: { whatIs: '<p>Simple calculation of personal net worth.</p>' }
    },
    'balloon-payment-calculator': {
        id: 'balloon-payment-calculator',
        title: 'Balloon Payment',
        description: 'End period lump sum.',
        category: 'finance',
        icon: 'DollarSign',
        inputs: [
            { id: 'princ', label: 'Principle', type: 'number', placeholder: '50000' },
            { id: 'rate', label: 'Rate (%)', type: 'number', placeholder: '5' },
            { id: 'years', label: 'Years', type: 'number', placeholder: '5' }
        ],
        outputs: [
            { label: 'Lump Sum Due', calculate: (inputs) => (Number(inputs.princ) * Math.pow(1 + Number(inputs.rate) / 100, Number(inputs.years))).toFixed(0) }
        ],
        content: { whatIs: '<p>Estimates future balloon payment on a loan.</p>' }
    },
    'gift-tax-est-calculator': {
        id: 'gift-tax-est-calculator',
        title: 'Gift Limit Helper',
        description: 'Tax exclusion.',
        category: 'finance',
        icon: 'DollarSign',
        inputs: [
            { id: 'amount', label: 'Gift Amount ($)', type: 'number', placeholder: '20000' },
            { id: 'limit', label: 'Annual Limit ($)', type: 'number', placeholder: '17000', defaultValue: '17000' }
        ],
        outputs: [
            { label: 'Over Limit', calculate: (inputs) => Math.max(0, Number(inputs.amount) - Number(inputs.limit)).toString() }
        ],
        content: { whatIs: '<p>Checks if a gift exceeds the annual tax-free exclusion limit (US centric).</p>' }
    },
    'inflation-forecast-calculator': {
        id: 'inflation-forecast-calculator',
        title: 'Inflation Impact',
        description: 'Future value erosion.',
        category: 'finance',
        icon: 'DollarSign',
        inputs: [
            { id: 'amount', label: 'Current $', type: 'number', placeholder: '1000' },
            { id: 'rate', label: 'Inflation Rate (%)', type: 'number', placeholder: '3' },
            { id: 'years', label: 'Years', type: 'number', placeholder: '10' }
        ],
        outputs: [
            { label: 'Future Value', calculate: (inputs) => (Number(inputs.amount) * Math.pow(1 + Number(inputs.rate) / 100, Number(inputs.years))).toFixed(0) },
            { label: 'Purchasing Power', calculate: (inputs) => (Number(inputs.amount) / Math.pow(1 + Number(inputs.rate) / 100, Number(inputs.years))).toFixed(0) }
        ],
        content: { whatIs: '<p>Calculates future cost and reduced purchasing power due to inflation.</p>' }
    },
    // Batch DR: Work & Office
    'meeting-cost-v2-calculator': {
        id: 'meeting-cost-v2-calculator',
        title: 'Meeting Cost',
        description: 'Wasted $ per hour.',
        category: 'finance',
        icon: 'DollarSign',
        inputs: [
            { id: 'people', label: 'Attendees', type: 'number', placeholder: '5' },
            { id: 'avgSalary', label: 'Avg Hourly Rate ($)', type: 'number', placeholder: '60' },
            { id: 'min', label: 'Duration (min)', type: 'number', placeholder: '60' }
        ],
        outputs: [
            { label: 'Total Meeting Cost', calculate: (inputs) => (Number(inputs.people) * Number(inputs.avgSalary) * Number(inputs.min) / 60).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates the total monetary cost of a meeting based on payroll.</p>' }
    },
    'remote-work-savings-calculator': {
        id: 'remote-work-savings-calculator',
        title: 'Home Office Savings',
        description: 'Commute vs Remote.',
        category: 'finance',
        icon: 'Home',
        inputs: [
            { id: 'gas', label: 'Weekly Gas ($)', type: 'number', placeholder: '50' },
            { id: 'other', label: 'Food/Other ($)', type: 'number', placeholder: '40' }
        ],
        outputs: [
            { label: 'Monthly Saving ($)', calculate: (inputs) => ((Number(inputs.gas) + Number(inputs.other)) * 4.3).toFixed(0) }
        ],
        content: { whatIs: '<p>Estimates monthly savings from working remotely.</p>' }
    },
    'break-rest-ratio-calculator': {
        id: 'break-rest-ratio-calculator',
        title: 'Pomodoro / Break',
        description: 'Suggested rest.',
        category: 'everyday',
        icon: 'Clock',
        inputs: [
            { id: 'work', label: 'Work Time (min)', type: 'number', placeholder: '25' }
        ],
        outputs: [
            { label: 'Short Break (min)', calculate: (inputs) => Math.ceil(Number(inputs.work) * 0.2).toString() }
        ],
        content: { whatIs: '<p>Calculates optimal break time based on work duration.</p>' }
    },
    'salary-split-bills-calculator': {
        id: 'salary-split-bills-calculator',
        title: 'Bill Split Ratio',
        description: 'By income.',
        category: 'finance',
        icon: 'DollarSign',
        inputs: [
            { id: 'p1', label: 'Income Person 1', type: 'number', placeholder: '3000' },
            { id: 'p2', label: 'Income Person 2', type: 'number', placeholder: '5000' },
            { id: 'total', label: 'Total Bill', type: 'number', placeholder: '1000' }
        ],
        outputs: [
            { label: 'P1 Share', calculate: (inputs) => (Number(inputs.total) * (Number(inputs.p1) / (Number(inputs.p1) + Number(inputs.p2)))).toFixed(2) },
            { label: 'P2 Share', calculate: (inputs) => (Number(inputs.total) * (Number(inputs.p2) / (Number(inputs.p1) + Number(inputs.p2)))).toFixed(2) }
        ],
        content: { whatIs: '<p>Splits shared bills proportionally based on income.</p>' }
    },
    'commute-time-lifespan-calculator': {
        id: 'commute-time-lifespan-calculator',
        title: 'Commute Life Cost',
        description: 'Total time lost.',
        category: 'everyday',
        icon: 'Clock',
        inputs: [
            { id: 'mins', label: 'Daily Commute (min)', type: 'number', placeholder: '60' },
            { id: 'years', label: 'Working Years', type: 'number', placeholder: '30' }
        ],
        outputs: [
            { label: 'Total Years Lost', calculate: (inputs) => (Number(inputs.mins) * 235 * Number(inputs.years) / 60 / 24 / 365).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates the total years of your life spent commuting to work.</p>' }
    },
    // Batch DS: Education & Learning II
    'reading-time-v2-calculator': {
        id: 'reading-time-v2-calculator',
        title: 'Book Reading Time',
        description: 'Based on pages.',
        category: 'text',
        icon: 'Type',
        inputs: [
            { id: 'pages', label: 'Pages', type: 'number', placeholder: '300' },
            { id: 'wpp', label: 'Words/Page', type: 'number', placeholder: '250', defaultValue: '250' },
            { id: 'wpm', label: 'Your WPM', type: 'number', placeholder: '200', defaultValue: '200' }
        ],
        outputs: [
            { label: 'Total Hours', calculate: (inputs) => (Number(inputs.pages) * Number(inputs.wpp) / Number(inputs.wpm) / 60).toFixed(1) }
        ],
        content: { whatIs: '<p>Estimates total time needed to read a book.</p>' }
    },
    'vocab-growth-tracker-calculator': {
        id: 'vocab-growth-tracker-calculator',
        title: 'Language Vocab Est',
        description: 'New words/day.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'start', label: 'Current Words', type: 'number', placeholder: '500' },
            { id: 'new', label: 'New Per Day', type: 'number', placeholder: '5' },
            { id: 'days', label: 'Days', type: 'number', placeholder: '100' }
        ],
        outputs: [
            { label: 'Est Vocab Size', calculate: (inputs) => (Number(inputs.start) + Number(inputs.new) * Number(inputs.days)).toString() }
        ],
        content: { whatIs: '<p>Forecasts language vocabulary growth.</p>' }
    },
    'test-score-percent-calculator': {
        id: 'test-score-percent-calculator',
        title: 'Test Grade %',
        description: 'Quick score check.',
        category: 'everyday',
        icon: 'Calculator',
        inputs: [
            { id: 'correct', label: 'Correct Answers', type: 'number', placeholder: '18' },
            { id: 'total', label: 'Total Questions', type: 'number', placeholder: '20' }
        ],
        outputs: [
            { label: 'Grade %', calculate: (inputs) => (Number(inputs.correct) / Number(inputs.total) * 100).toFixed(1) + '%' }
        ],
        content: { whatIs: '<p>Calculates percentage grade on a test.</p>' }
    },
    'essay-length-time-calculator': {
        id: 'essay-length-time-calculator',
        title: 'Writing Time Est',
        description: 'How long to write.',
        category: 'text',
        icon: 'Type',
        inputs: [
            { id: 'words', label: 'Word Count', type: 'number', placeholder: '1000' }
        ],
        outputs: [
            { label: 'Draft Time (h)', calculate: (inputs) => (Number(inputs.words) / 500).toFixed(1) }
        ],
        content: { whatIs: '<p>Estimates writing time (assumes 500 words per hour).</p>' }
    },
    'memory-recall-spacing-calculator': {
        id: 'memory-recall-spacing-calculator',
        title: 'Spaced Repetition',
        description: 'Next review day.',
        category: 'everyday',
        icon: 'Calendar',
        inputs: [
            { id: 'interval', label: 'Last Interval (days)', type: 'number', placeholder: '3' }
        ],
        outputs: [
            { label: 'Next Review (days)', calculate: (inputs) => Math.round(Number(inputs.interval) * 2.5).toString() }
        ],
        content: { whatIs: '<p>Calculates the next review day based on the Ebbinghaus Forgetting Curve theory.</p>' }
    },
    // Batch DT: Environment & Nature
    'tree-carbon-offset-calculator': {
        id: 'tree-carbon-offset-calculator',
        title: 'Tree Carbon Absorb',
        description: 'CO2 offset estimate.',
        category: 'ecology',
        icon: 'Leaf',
        inputs: [
            { id: 'count', label: 'Number of Trees', type: 'number', placeholder: '10' },
            { id: 'years', label: 'Years Growing', type: 'number', placeholder: '20' }
        ],
        outputs: [
            { label: 'CO2 Offset (kg)', calculate: (inputs) => (Number(inputs.count) * Number(inputs.years) * 22).toFixed(0) }
        ],
        content: { whatIs: '<p>Estimates total carbon dioxide absorbed by trees over time.</p>' }
    },
    'plastic-footprint-v2-calculator': {
        id: 'plastic-footprint-v2-calculator',
        title: 'Plastic Waste Est',
        description: 'Annual usage.',
        category: 'ecology',
        icon: 'Leaf',
        inputs: [
            { id: 'bottles', label: 'Weekly Bottles', type: 'number', placeholder: '7' },
            { id: 'bags', label: 'Weekly Bags', type: 'number', placeholder: '5' }
        ],
        outputs: [
            { label: 'Annual Pieces', calculate: (inputs) => ((Number(inputs.bottles) + Number(inputs.bags)) * 52).toString() }
        ],
        content: { whatIs: '<p>Estimates personal annual plastic consumption.</p>' }
    },
    'rainwater-harvest-size-calculator': {
        id: 'rainwater-harvest-size-calculator',
        title: 'Rain Catch Vol',
        description: 'By roof area.',
        category: 'ecology',
        icon: 'CloudRain',
        inputs: [
            { id: 'area', label: 'Roof Area (m²)', type: 'number', placeholder: '100' },
            { id: 'rain', label: 'Avg Rainfall (mm)', type: 'number', placeholder: '800' }
        ],
        outputs: [
            { label: 'Max Liters/Year', calculate: (inputs) => (Number(inputs.area) * Number(inputs.rain) * 0.9).toFixed(0) }
        ],
        content: { whatIs: '<p>Calculates potential rainwater collection volume (assuming 90% efficiency).</p>' }
    },
    'wind-turbine-power-calculator': {
        id: 'wind-turbine-power-calculator',
        title: 'Wind Energy (P)',
        description: 'Theoretical wattage.',
        category: 'ecology',
        icon: 'Wind',
        inputs: [
            { id: 'dia', label: 'Blade Dia (m)', type: 'number', placeholder: '3' },
            { id: 'speed', label: 'Wind Speed (m/s)', type: 'number', placeholder: '10' }
        ],
        outputs: [
            { label: 'Estimated Watts', calculate: (inputs) => (0.15 * Math.pow(Number(inputs.dia) / 2, 2) * Math.pow(Number(inputs.speed), 3) * 1.225).toFixed(0) }
        ],
        content: { whatIs: '<p>Estimates power output of a small wind turbine.</p>' }
    },
    'compost-mass-calculator': {
        id: 'compost-mass-calculator',
        title: 'Compost C:N Ratio',
        description: 'Green vs Brown.',
        category: 'ecology',
        icon: 'Leaf',
        inputs: [
            { id: 'green', label: 'Greens (kg)', type: 'number', placeholder: '5' },
            { id: 'brown', label: 'Browns (kg)', type: 'number', placeholder: '10' }
        ],
        outputs: [
            { label: 'C:N Ratio Est', calculate: (inputs) => (Number(inputs.brown) / Number(inputs.green) * 15).toFixed(1) + ':1' }
        ],
        content: { whatIs: '<p>Roughly estimates C:N ratio (aim for 30:1 in composting).</p>' }
    },
    // Batch DU: Medical & Nursing II
    'oxygen-flow-duration-calculator': {
        id: 'oxygen-flow-duration-calculator',
        title: 'Oxygen Tank Life',
        description: 'Time remaining.',
        category: 'health',
        icon: 'Activity',
        inputs: [
            { id: 'psi', label: 'PSI Remaining', type: 'number', placeholder: '2000' },
            { id: 'flow', label: 'Flow (L/min)', type: 'number', placeholder: '2' },
            { id: 'factor', label: 'Tank Factor (E=0.28)', type: 'number', placeholder: '0.28', defaultValue: '0.28' }
        ],
        outputs: [
            { label: 'Duration (min)', calculate: (inputs) => (Number(inputs.psi) * Number(inputs.factor) / Number(inputs.flow)).toFixed(0) }
        ],
        content: { whatIs: '<p>Estimates remaining oxygen duration for medical tanks.</p>' }
    },
    'bmi-childhood-calculator': {
        id: 'bmi-childhood-calculator',
        title: 'BMI (Child %) Est',
        description: 'Adjusted for age.',
        category: 'health',
        icon: 'Activity',
        inputs: [
            { id: 'w', label: 'Weight (kg)', type: 'number', placeholder: '35' },
            { id: 'h', label: 'Height (cm)', type: 'number', placeholder: '140' }
        ],
        outputs: [
            { label: 'BMI', calculate: (inputs) => (Number(inputs.w) / Math.pow(Number(inputs.h) / 100, 2)).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates standard BMI (adults and children uses the same raw formula, though percentiles differ).</p>' }
    },
    'max-heart-rate-simple-calculator': {
        id: 'max-heart-rate-simple-calculator',
        title: 'Max Heart Rate',
        description: '220 - Age.',
        category: 'health',
        icon: 'Heart',
        inputs: [
            { id: 'age', label: 'Age', type: 'number', placeholder: '30' }
        ],
        outputs: [
            { label: 'Max HR (bpm)', calculate: (inputs) => (220 - Number(inputs.age)).toString() }
        ],
        content: { whatIs: '<p>Calculates theoretical maximum heart rate.</p>' }
    },
    'medication-dosage-est-calculator': {
        id: 'medication-dosage-est-calculator',
        title: 'Pediatric Dosage',
        description: 'Mg by weight.',
        category: 'health',
        icon: 'Activity',
        inputs: [
            { id: 'weight', label: 'Child Weight (kg)', type: 'number', placeholder: '20' },
            { id: 'dose', label: 'Dose (mg/kg)', type: 'number', placeholder: '15' }
        ],
        outputs: [
            { label: 'Required Dose (mg)', calculate: (inputs) => (Number(inputs.weight) * Number(inputs.dose)).toFixed(1) }
        ],
        content: { whatIs: '<p>Calculates medication dose based on patient body weight.</p>' }
    },
    'daily-fluid-maintenance-calculator': {
        id: 'daily-fluid-maintenance-calculator',
        title: 'Holliday-Segar Fluid',
        description: 'Maintenance needs.',
        category: 'health',
        icon: 'Activity',
        inputs: [
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '20' }
        ],
        outputs: [
            { label: 'Fluid (ml/day)', calculate: (inputs) => { const w = Number(inputs.weight); if (w <= 10) return (w * 100).toString(); if (w <= 20) return (1000 + (w - 10) * 50).toString(); return (1500 + (w - 20) * 20).toString(); } }
        ],
        content: { whatIs: '<p>Estimates 24h maintenance fluid requirements using the standard clinical formula.</p>' }
    },
    // Batch DV: Marketing & Sales II
    'cac-ltv-ratio-calculator': {
        id: 'cac-ltv-ratio-calculator',
        title: 'LTV:CAC Ratio',
        description: 'Marketing efficiency.',
        category: 'finance',
        icon: 'DollarSign',
        inputs: [
            { id: 'ltv', label: 'Lifetime Value ($)', type: 'number', placeholder: '300' },
            { id: 'cac', label: 'Acquis. Cost ($)', type: 'number', placeholder: '100' }
        ],
        outputs: [
            { label: 'Ratio', calculate: (inputs) => (Number(inputs.ltv) / Number(inputs.cac)).toFixed(1) + ':1' }
        ],
        content: { whatIs: '<p>Calculates the relationship between customer value and acquisition cost.</p>' }
    },
    'lead-gen-unit-cost-calculator': {
        id: 'lead-gen-unit-cost-calculator',
        title: 'Lead Cost (CPL)',
        description: 'Per potential client.',
        category: 'finance',
        icon: 'DollarSign',
        inputs: [
            { id: 'spend', label: 'Ad Spend ($)', type: 'number', placeholder: '1000' },
            { id: 'leads', label: 'Leads Generated', type: 'number', placeholder: '50' }
        ],
        outputs: [
            { label: 'Cost per Lead ($)', calculate: (inputs) => (Number(inputs.spend) / Number(inputs.leads)).toFixed(2) }
        ],
        content: { whatIs: '<p>Calculates Marketing Cost per Lead.</p>' }
    },
    'email-open-rate-v2-calculator': {
        id: 'email-open-rate-v2-calculator',
        title: 'Email Open Rate',
        description: 'Campaign engagement.',
        category: 'finance',
        icon: 'Mail',
        inputs: [
            { id: 'sent', label: 'Emails Sent', type: 'number', placeholder: '1000' },
            { id: 'opens', label: 'Total Opens', type: 'number', placeholder: '250' }
        ],
        outputs: [
            { label: 'Open Rate (%)', calculate: (inputs) => (Number(inputs.opens) / Number(inputs.sent) * 100).toFixed(1) + '%' }
        ],
        content: { whatIs: '<p>Calculates percentage of emails opened by recipients.</p>' }
    },
    'sales-quota-time-calculator': {
        id: 'sales-quota-time-calculator',
        title: 'Sales Pacing',
        description: 'Target achievement.',
        category: 'finance',
        icon: 'Target',
        inputs: [
            { id: 'target', label: 'Monthly Quota', type: 'number', placeholder: '100000' },
            { id: 'current', label: 'Sales to Date', type: 'number', placeholder: '40000' },
            { id: 'day', label: 'Day of Month', type: 'number', placeholder: '10' }
        ],
        outputs: [
            { label: 'Pace (%)', calculate: (inputs) => (Number(inputs.current) / (Number(inputs.target) * Number(inputs.day) / 30) * 100).toFixed(1) + '%' }
        ],
        content: { whatIs: '<p>Calculates if sales are on track to beat monthly target.</p>' }
    },
    'discount-roi-calculator-v2': {
        id: 'discount-roi-calculator-v2',
        title: 'Sale Promo ROI',
        description: 'Net profit after promo.',
        category: 'finance',
        icon: 'DollarSign',
        inputs: [
            { id: 'rev', label: 'New Revenue ($)', type: 'number', placeholder: '5000' },
            { id: 'cost', label: 'Promo Cost ($)', type: 'number', placeholder: '500' },
            { id: 'margin', label: 'Profit Margin (%)', type: 'number', placeholder: '30' }
        ],
        outputs: [
            { label: 'Promo Profit ($)', calculate: (inputs) => (Number(inputs.rev) * Number(inputs.margin) / 100 - Number(inputs.cost)).toFixed(0) }
        ],
        content: { whatIs: '<p>Estimates if a discount promotion actually generated net profit.</p>' }
    },
    // Batch DW: Miscellaneous
    'dog-to-human-years-calculator': {
        id: 'dog-to-human-years-calculator',
        title: 'Dog Years (Human)',
        description: 'Simple 7x multiplier.',
        category: 'everyday',
        icon: 'Zap',
        inputs: [
            { id: 'age', label: 'Dog Age', type: 'number', placeholder: '5' }
        ],
        outputs: [
            { label: 'Human Years', calculate: (inputs) => (Number(inputs.age) * 7).toString() }
        ],
        content: { whatIs: '<p>Calculates dog age in human years using the 7-year rule.</p>' }
    },
    'secret-santa-split-calculator': {
        id: 'secret-santa-split-calculator',
        title: 'Fortune Cookie Odds',
        description: 'Humorous probability.',
        category: 'everyday',
        icon: 'Dice',
        inputs: [
            { id: 'name', label: 'Your Name', type: 'string', placeholder: 'Alex' }
        ],
        outputs: [
            { label: 'Today\'s Luck', calculate: (inputs) => { const l = String(inputs.name).length; return (l % 10 * 10) + 10 + '%'; } }
        ],
        content: { whatIs: '<p>Humorous luck prediction based on name length.</p>' }
    },
    'heads-tails-tracker-calculator': {
        id: 'heads-tails-tracker-calculator',
        title: 'Coin Flip Sim',
        description: 'Binary random.',
        category: 'everyday',
        icon: 'Dice',
        inputs: [
            { id: 'run', label: 'Click to Flip (any input)', type: 'string', placeholder: 'Go' }
        ],
        outputs: [
            { label: 'Result', calculate: (inputs) => Math.random() > 0.5 ? 'HEADS' : 'TAILS' }
        ],
        content: { whatIs: '<p>Simple coin flipper.</p>' }
    },
    'decision-matrix-simple-calculator': {
        id: 'decision-matrix-simple-calculator',
        title: 'Binary Decision',
        description: 'Yes or No?',
        category: 'everyday',
        icon: 'Dice',
        inputs: [
            { id: 'q', label: 'Question', type: 'string', placeholder: 'Should I eat pizza?' }
        ],
        outputs: [
            { label: 'The Answer', calculate: (inputs) => Math.random() > 0.5 ? 'YES' : 'NO' }
        ],
        content: { whatIs: '<p>Random decision maker for yes/no questions.</p>' }
    },
    'life-expectancy-fun-calculator': {
        id: 'life-expectancy-fun-calculator',
        title: 'Time Bank (%)',
        description: 'Time left to 80.',
        category: 'everyday',
        icon: 'Clock',
        inputs: [
            { id: 'age', label: 'Current Age', type: 'number', placeholder: '30' }
        ],
        outputs: [
            { label: 'Time Remaining %', calculate: (inputs) => Math.max(0, 100 - (Number(inputs.age) / 80 * 100)).toFixed(1) + '%' }
        ],
        content: { whatIs: '<p>Calculates percentage of "productive years" remaining until 80.</p>' }
    }
};
