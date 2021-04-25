const statPipeline = [
  {
    $facet: {
      mostSpend: [
        {
          $match: {
            type: 'expenses',
          },
        }, {
          $group: {
            _id: '$category',
            sum: {
              $sum: '$amount',
            },
          },
        }, {
          $project: {
            _id: 0,
            category: '$_id',
            sum: 1,
          },
        }, {
          $sort: {
            sum: -1,
          },
        }, {
          $limit: 3,
        },
      ],
      perMonth: [
        {
          $group: {
            _id: {
              year: {
                $year: '$date',
              },
              month: {
                $month: '$date',
              },
              type: '$type',
            },
            sumMonth: {
              $sum: '$amount',
            },
          },
        }, {
          $group: {
            _id: '$_id.type',
            avgMonth: {
              $avg: '$sumMonth',
            },
          },
        }, {
          $group: {
            _id: 0,
            avgMonth: {
              $mergeObjects: {
                $arrayToObject: [
                  [
                    {
                      k: {
                        $toString: '$_id',
                      },
                      v: '$avgMonth',
                    },
                  ],
                ],
              },
            },
          },
        },
      ],
      perYear: [
        {
          $group: {
            _id: {
              year: {
                $year: '$date',
              },
              month: {
                $month: '$date',
              },
              type: '$type',
            },
            sumMonth: {
              $sum: '$amount',
            },
          },
        }, {
          $group: {
            _id: {
              year: '$_id.year',
              type: '$_id.type',
            },
            sumYear: {
              $sum: '$sumMonth',
            },
          },
        }, {
          $group: {
            _id: '$_id.type',
            avgYear: {
              $avg: '$sumYear',
            },
            total: {
              $sum: '$sumYear',
            },
            years: {
              $mergeObjects: {
                $arrayToObject: [
                  [
                    {
                      k: {
                        $toString: '$_id.year',
                      },
                      v: '$sumYear',
                    },
                  ],
                ],
              },
            },
          },
        }, {
          $group: {
            _id: 0,
            perYear: {
              $mergeObjects: {
                $arrayToObject: [
                  [
                    {
                      k: {
                        $toString: '$_id',
                      },
                      v: '$$ROOT',
                    },
                  ],
                ],
              },
            },
          },
        },
      ],
    },
  }, {
    $project: {
      mostSpend: '$mostSpend.category',
      avgMonth: {
        $arrayElemAt: [
          '$perMonth.avgMonth', 0,
        ],
      },
      perYear: {
        $arrayElemAt: [
          '$perYear.perYear', 0,
        ],
      },
    },
  },
];

const statPipelineForUser = (userId) => {
  const userMatchStage = { $match: { user: userId } };
  return [userMatchStage, ...statPipeline];
};
export default statPipelineForUser;
