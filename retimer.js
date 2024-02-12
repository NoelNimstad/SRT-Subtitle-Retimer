const PATH = "in.txt";
const OUTPUT = "out.txt";
const OFFSET = -10; // in seconds

async function Main()
{
    const MS_OFFSET = OFFSET * 1000;
    const file = Bun.file("in.txt");
    let text = await file.text();
    text = text.trim("\n");

    const lines = text.split("\n\n");
    for(const line of lines)
    {
        const o = line.split("\n")[1];
        let nO = o;
        const op = o.split(" --> ");
        for(const p of op)
        {
            const [time, ms] = p.split(",");
            const [hours, minutes, seconds] = time.split(":");

            const tMs = (parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseFloat(seconds)) * 1000 + parseInt(ms, 10);
            const sMs = tMs + MS_OFFSET;

            const nHours = Math.floor(sMs / (3600 * 1000));
            const rMs = sMs % (3600 * 1000);
            const nMinutes = Math.floor(rMs / (60 * 1000));
            const rSeconds = rMs % (60 * 1000) / 1000;
            const nMs = Math.round(rSeconds * 1000);

            const formattedTime = `${ Pad(nHours) }:${ Pad(nMinutes) }:${ Pad(rSeconds.toFixed(0)) },${ Pad(nMs, 3).substring(0, 3) }`;
            nO = nO.replace(p, formattedTime);
        }

        const nLine = line.replace(o, nO);
        text = text.replace(line, nLine);
    }

    Bun.write(OUTPUT, text);
}

function Pad(number, width = 2)
{
    return String(number).padStart(width, '0');
}

Main();