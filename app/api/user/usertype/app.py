cities = ["Kochi", "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Jaipur", "Ahmedabad", "Lucknow"]

grouped_dict = {}
for item in cities:
    length = len(item)
    if length not in grouped_dict:
        grouped_dict[length] = []
    grouped_dict[length].append(item)
new_li = list(grouped_dict.values())

print(new_li)


# print(result_li)