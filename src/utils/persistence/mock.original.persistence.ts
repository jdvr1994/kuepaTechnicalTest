/**
 * it is the mocked data base to do tests
 */
export const originalDb = {
    users: [
    {
        id:"615625717c46544d2868e2f7",
        login_at:[
            {"$date":"2021-09-30T21:01:20.527Z"},
            {"$date":"2021-09-30T22:10:37.685Z"},
            {"$date":"2021-09-30T23:14:11.666Z"}
        ],
        type:"student",
        userName:"estudiante1",
        password:"$2a$10$uPkuw1wOkGHGrNlPlzOnqOu4RGU97ZwgvIfJBAbsxLMvbA59KWWPm",
        names:"Pepito",
        lastNames:"Pérez",
        created_at:{"$date":"2021-09-30T21:00:33.040Z"}
    },
    {
        id:"615625717c46544d2868e2f8",
        login_at:[
            {"$date":"2021-09-30T25:01:20.527Z"},
        ],
        type:"moderator",
        userName:"profesorSuperO",
        password:"$2a$10$Qxs0Lo4RgnVAD9MkLsyXe.hhXBnJ2R5U47SLvMHTsPeB/LcoBsUvG",
        names:"Profesor",
        lastNames:"Super O",
        created_at:{"$date":"2021-09-30T21:00:33.040Z"}
    },
    {
        id:"615625717c46544d2868e2f9",
        login_at:[
            {"$date":"2021-09-30T25:01:20.527Z"},
        ],
        type:"moderator",
        userName:"elProfesor",
        password:"$2a$10$Qxs0Lo4RgnVAD9MkLsyXe.hhXBnJ2R5U47SLvMHTsPeB/LcoBsUvG",
        names:"El profesor",
        lastNames:"***",
        created_at:{"$date":"2021-09-30T21:00:33.040Z"}
    },
    {
        id:"615625717c46544d2868e2f10",
        login_at:[
            {"$date":"2021-09-30T21:01:20.527Z"}
        ],
        type:"student",
        userName:"estudiante2",
        password:"$2a$10$L0YBhqGYTw1fakjf./OrKevNMNb0XXV/dvE5ShLPVMo3XCWGwfArq",
        names:"Juanita",
        lastNames:"Alvarado",
        created_at:{"$date":"2021-09-31T21:00:33.040Z"}
    }],
    classes: []
};