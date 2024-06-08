
from serverstub.models import ImprovementWork


class serverstubSerializer:

    def serialize(data):
        serialized_data = []
        for item in data:
            iw_dict = {
                "id": item[0],
                "department": item[1],
                "name": item[2],
                "owner": item[3],
                "description": item[4],
                "participants": item[5],
                "stage": item[7],
                "priority": item[8],
                "comments": item[9],
                "upvote": item[10],
                "downvote": item[11],
            }
            serialized_data.append(iw_dict)
        return serialized_data