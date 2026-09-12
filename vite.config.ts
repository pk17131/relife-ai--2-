import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

// LINT.IfChange(aistudio_media_plugin)
function aistudioMediaPlugin(): Plugin {
  return {
    name: 'vite-plugin-aistudio-media',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/assets/aistudio/')) {
          const rawPath = req.url.split('?')[0].split('#')[0];
          try {
            const decodedPath = decodeURIComponent(rawPath);
            const relativePath = decodedPath.replace(/^\//, '');
            const aistudioDir = path.resolve(
              __dirname,
              'public',
              'assets',
              'aistudio',
            );
            const filePath = path.resolve(__dirname, 'public', relativePath);
            if (
              filePath.startsWith(aistudioDir + path.sep) &&
              fs.existsSync(filePath) &&
              fs.statSync(filePath).isFile()
            ) {
              const ext = path.extname(filePath).toLowerCase();
              const mimeMap: Record<string, string> = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp',
                '.svg': 'image/svg+xml',
                '.bmp': 'image/bmp',
                '.ico': 'image/x-icon',
                '.mp4': 'video/mp4',
                '.webm': 'video/webm',
                '.ogv': 'video/ogg',
                '.mp3': 'audio/mpeg',
                '.wav': 'audio/wav',
                '.ogg': 'audio/ogg',
                '.pdf': 'application/pdf',
              };
              res.setHeader(
                'Content-Type',
                mimeMap[ext] || 'application/octet-stream',
              );
              res.setHeader('Cache-Control', 'no-cache');
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          } catch {
            // Fall through if URI decoding or file access fails
          }
        }
        next();
      });
    },
  };
}
// LINT.ThenChange(//depot/google3/java/com/google/alkali/boq/makersuite/applet_dev_service/templates/initializers/react_theme/vite.config.ts:aistudio_media_plugin)

function geminiApiPlugin(): Plugin {
  return {
    name: 'vite-plugin-gemini-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/analyze-battery' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            res.setHeader('Content-Type', 'application/json');
            try {
              const battery = JSON.parse(body || '{}');
              const apiKey = process.env.GEMINI_API_KEY;
              if (!apiKey) {
                res.end(JSON.stringify({ fallback: true, message: 'GEMINI_API_KEY is not set' }));
                return;
              }

              const { GoogleGenAI } = await import('@google/genai');
              const ai = new GoogleGenAI({
                apiKey,
                httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
              });

              const prompt = `You are ReLife AI's Battery Lifecycle Assessment Engine.
Analyze the following used battery data:
- Battery ID: ${battery.batteryId || 'Unknown'}
- Battery Type: ${battery.batteryType || 'EV'}
- Chemistry: ${battery.chemistry || 'LFP'}
- Original Capacity: ${battery.originalCapacity} Ah
- Current Capacity: ${battery.currentCapacity} Ah
- Nominal Voltage: ${battery.nominalVoltage} V
- Cycle Count: ${battery.cycleCount}
- Operating Temperature: ${battery.temperature}°C
- Manufacturing Year: ${battery.manufacturingYear}
- Current Application: ${battery.currentApplication}

SAFETY & SYSTEM INSTRUCTIONS:
1. Never claim that AI certifies battery safety.
2. The system must clearly describe results as "AI-assisted prototype estimate".
3. Professional diagnostics are required before real-world deployment.
4. Never invent measured battery data. Never change user-entered values. Use available battery information only.
5. Determine which of these 4 possible lifecycle outcomes applies: Reuse, Refurbish, Repurpose, Recycle.

Respond with strict JSON adhering to this schema:
{
  "healthClassification": "string (e.g. Second-Life Ready, Refurbishment Candidate, Recycling / End-of-Life)",
  "reLifeScore": number (0 to 100 prototype score),
  "lifecycleRecommendation": "Reuse" | "Refurbish" | "Repurpose" | "Recycle",
  "secondLifeRecommendation": "string (specific target application, e.g. Stationary Solar Storage)",
  "reasoning": "string explaining degradation indicators and why this pathway is recommended without claiming safety certification",
  "alternativeApplications": ["string", "string"],
  "riskFlags": ["string", "string"],
  "confidence": number (integer between 80 and 98)
}`;

              const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('AI request timeout')), 3800)
              );

              const generatePromise = ai.models.generateContent({
                model: 'gemini-3.8-flash',
                contents: prompt,
                config: {
                  responseMimeType: 'application/json'
                }
              });

              const response: any = await Promise.race([generatePromise, timeoutPromise]);
              const rawText = response?.text;

              if (!rawText) {
                res.end(JSON.stringify({ fallback: true, message: 'Empty response from model' }));
                return;
              }

              const parsed = JSON.parse(rawText);
              res.end(JSON.stringify({
                success: true,
                result: parsed
              }));
            } catch (err: any) {
              // Silent fallback on any model error, 503, rate limit, or timeout
              res.end(JSON.stringify({ fallback: true, error: err.message || 'Error occurred' }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), aistudioMediaPlugin(), geminiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
