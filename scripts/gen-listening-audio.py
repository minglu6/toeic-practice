#!/usr/bin/env python3
"""Generate TOEIC-style listening sample MP3s with edge-tts."""
import asyncio
import pathlib
import sys

EDGE = pathlib.Path('/workspace/.venv-tts/bin/edge-tts')
ROOT = pathlib.Path(__file__).resolve().parents[1]

# Use same voice family as existing TOEIC listening on this box
VOICES = {
    'narrator': 'en-US-JennyNeural',
    'man': 'en-US-GuyNeural',
    'woman': 'en-US-AriaNeural',
}

JOBS = [
    # Part 1 set1: four statements
    {
        'out': ROOT / 'audio/part1/set1.mp3',
        'parts': [
            (VOICES['narrator'], 'Look at the picture. Mark your answer on your answer sheet.'),
            (VOICES['narrator'], 'A. A woman is watering plants in a garden.'),
            (VOICES['narrator'], 'B. A man is giving a presentation to a small group.'),
            (VOICES['narrator'], 'C. Workers are loading boxes onto a truck.'),
            (VOICES['narrator'], 'D. Customers are waiting in line at a café.'),
        ],
    },
    {
        'out': ROOT / 'audio/part1/set2.mp3',
        'parts': [
            (VOICES['narrator'], 'Look at the picture. Mark your answer on your answer sheet.'),
            (VOICES['narrator'], 'A. A chef is tasting soup in a kitchen.'),
            (VOICES['narrator'], 'B. A clerk is scanning items at a register.'),
            (VOICES['narrator'], 'C. A woman is looking at a map on a wall.'),
            (VOICES['narrator'], 'D. Two people are shaking hands in a lobby.'),
        ],
    },
    # Part 2
    {
        'out': ROOT / 'audio/part2/q1.mp3',
        'parts': [
            (VOICES['man'], 'Where should I put these shipping labels?'),
            (VOICES['narrator'], 'A.'),
            (VOICES['woman'], 'They arrive every Tuesday.'),
            (VOICES['narrator'], 'B.'),
            (VOICES['woman'], 'On the shelf next to the printer.'),
            (VOICES['narrator'], 'C.'),
            (VOICES['woman'], 'Yes, I ordered more last week.'),
        ],
    },
    {
        'out': ROOT / 'audio/part2/q2.mp3',
        'parts': [
            (VOICES['woman'], 'Has the client approved the revised proposal?'),
            (VOICES['narrator'], 'A.'),
            (VOICES['man'], "Not yet — they're still reviewing it."),
            (VOICES['narrator'], 'B.'),
            (VOICES['man'], "It's scheduled for Thursday morning."),
            (VOICES['narrator'], 'C.'),
            (VOICES['man'], 'In the conference room upstairs.'),
        ],
    },
    {
        'out': ROOT / 'audio/part2/q3.mp3',
        'parts': [
            (VOICES['man'], 'Who is covering the front desk this afternoon?'),
            (VOICES['narrator'], 'A.'),
            (VOICES['woman'], 'About two hours from now.'),
            (VOICES['narrator'], 'B.'),
            (VOICES['woman'], 'Please use the side entrance.'),
            (VOICES['narrator'], 'C.'),
            (VOICES['woman'], 'Marco said he would.'),
        ],
    },
    # Part 3 dialogue
    {
        'out': ROOT / 'audio/part3/set1.mp3',
        'parts': [
            (VOICES['man'], 'Hi, Maria. Do you still have the draft of the quarterly sales report? I need to send it to the regional manager by four.'),
            (VOICES['woman'], "I finished revising it this morning. It's saved in the shared folder under Finance. Just make sure you use the version labeled Final."),
            (VOICES['man'], 'Got it. Should I also attach the expense summary from last month?'),
            (VOICES['woman'], "No, he only asked for the sales figures. The expense summary can wait until Friday's meeting."),
        ],
    },
    # Part 4 talk
    {
        'out': ROOT / 'audio/part4/set1.mp3',
        'parts': [
            (VOICES['narrator'], "Good morning, everyone. This is a reminder that the building's fire drill will take place tomorrow at 10:15 a.m. When the alarm sounds, please leave your desks immediately and exit through the nearest stairwell. Do not use the elevators. Assembly Point B is located in the north parking lot near the flagpole. Department supervisors should bring their attendance sheets. If you have mobility concerns, contact Facilities today so we can arrange assistance. Thank you for your cooperation."),
        ],
    },
]


async def synth_one(text: str, voice: str, path: pathlib.Path):
    import edge_tts
    await edge_tts.Communicate(text, voice).save(str(path))


async def concat_job(job):
    import edge_tts
    out = job['out']
    out.parent.mkdir(parents=True, exist_ok=True)
    tmp_files = []
    for i, (voice, text) in enumerate(job['parts']):
        tmp = out.parent / f'.tmp_{out.stem}_{i}.mp3'
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(str(tmp))
        tmp_files.append(tmp)
    # naive concat of mp3 bytes (edge-tts outputs mpeg frames; works for simple concat)
    data = b''.join(p.read_bytes() for p in tmp_files)
    out.write_bytes(data)
    for p in tmp_files:
        p.unlink(missing_ok=True)
    print('wrote', out.relative_to(ROOT), out.stat().st_size)


async def main():
    # Prefer importing edge_tts from the venv
    sys.path.insert(0, '/workspace/.venv-tts/lib/python3.13/site-packages')
    try:
        import edge_tts  # noqa
    except ImportError:
        sys.path.insert(0, '/workspace/.venv-tts/lib/python3.13/site-packages')
        import edge_tts  # noqa
    for job in JOBS:
        await concat_job(job)


if __name__ == '__main__':
    asyncio.run(main())
