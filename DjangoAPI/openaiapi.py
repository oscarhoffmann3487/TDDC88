import openai

openai.api_key = 'insert api key here'

""" with open('descriptions.txt', 'a') as file:
    for i in range(3):  # Replace 100 with the number of descriptions you want to generate
        completion = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an expert at improvement work at hospitals"},
            {"role": "user", "content": "Describe an improvement work that can be done in a hospital setting. Your response should be 300-500 characters long and be realistic. An example could be the following: In response to the growing need for exceptional healthcare services and a commitment to delivering superior patient care, we are thrilled to introduce the establishment of a new division focused on achieving excellence in healthcare delivery. This initiative will encompass the development of cutting-edge medical facilities, the acquisition of advanced medical technologies, and the recruitment of top-tier medical professionals to meet the escalating demands for outstanding healthcare outcomes."}
            ]
        )
        # Write the generated description to the file, followed by a newline
        file.write('IW' + str(i) + '\n' + completion['choices'][0]['message']['content'].strip() + '\n')
    """
with open('descriptions.txt', 'a') as file:
    
    units = [
        "Barn- och kvinnocentrum",
        "Centrum för kirurgi, ortopedi och cancervård",
        "Diagnostikcentrum",
        "Hjärtcentrum",
        "Medicincentrum",
        "Primärvårdscentrum",
        "Psykriatricentrum",
        "Sinnescentrum"
    ]

    import json
    improvements = {}
    for unit in units:
        improvements[unit] = []
        for _ in range(1):
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert at coming up with improvement works for different professions/units."
                    },
                    {
                        "role": "user",
                        "content": f"Please suggest an improvement work for a {unit}. The improvement work should be like this: 'In response to the increasing demand for excellence and success in the world of football, we're excited to announce the formation of a new division dedicated to achieving top-tier performance on the pitch. This expansion involves creating state-of-the-art training facilities, acquiring cutting-edge equipment, and scouting top talent to meet the growing expectations for football excellence. Between 200 and 300 words. Make it in json format with unit as identifyer with two values: name of improvment work, and the improvment work description. This is the format it should be in Medicincentrum: [ ImprovementWorkDescription: Revolutionizing Medicincentrum through Technological Advancements and Enhanced Human Resources, improvement_work : Recognizing the escalating demand for superior quality in the field of health care, we are thrilled to unfold the Medicincentrum Improvem. other words, the result should be a viable json format. maximum 1000 characters per description "
                    }
                ]
            )
        improvements[unit].append(response.choices[0].message['content'])

    # Write the generated descriptions to the file in JSON format
    with open('descriptions.txt', 'w') as file:
        json.dump(improvements, file)