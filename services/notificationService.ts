
// Huduma ya Tuma SMS na Email kwa Otomatiki

interface SendSMSParams {
  to: string;
  message: string;
}

export const sendSMS = async ({ to, message }: SendSMSParams) => {
  console.log(`[GraceFlow SMS] Inatuma kwenda: ${to}...`);
  console.log(`[SMS Content]: ${message}`);
  
  const apiKey = process.env.NEXTSMS_API_KEY;
  
  // Ikiwa hakuna API Key (Dev Mode), tunasimulisha mafanikio ili usikwame
  if (!apiKey || apiKey === 'placeholder-key') {
    console.info('SMS Simulation: Ujumbe ungeenda sasa ikiwa API Key ingekuwepo.');
    return { status: 'simulated_success', message: 'SMS logged in console' };
  }

  try {
    const response = await fetch('https://messaging-service.co.tz/api/v2/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'GRACEFLOW',
        to: to,
        text: message
      })
    });
    
    if (!response.ok) {
      console.warn(`SMS Provider returned ${response.status}. Hii inaweza kuwa ni CORS au Salio.`);
      return { error: 'provider_error', status: response.status };
    }
    
    return await response.json();
  } catch (error) {
    // Hapa ndipo 'Failed to fetch' hutokea (Network/CORS error)
    // Tunairudisha kimyakimya ili isiharibu usajili wa muumini
    console.error('SMS Network/CORS Error: Huwezi kupiga API ya SMS moja kwa moja kutoka browser kwa usalama.');
    return { error: 'fetch_blocked', details: 'Possible CORS or No Connection' };
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  console.log(`[Email Queue] Sending Welcome Email to ${name} (${email}) via GraceFlow Mailer...`);
  // Simulation kwa ajili ya usajili wa haraka
  return Promise.resolve({ status: 200, text: "OK (Simulated)" });
};
